from typing import List
from fastapi import APIRouter, File, Form, HTTPException, Depends, Query, Request, UploadFile, status, BackgroundTasks
from fastapi.security import HTTPBearer
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repository import user as repositories_users
from app.schemas.user import UserCreationSchema, UserResponseSchema
from app.core.security import auth_service
from app.services.otp import send_email
from app.models.users import Role
from app.services.roles import RoleAccess
from app.services.cloudinary import cloudinary

admin_router = APIRouter(prefix='/admin', tags=['admin'])
get_refresh_token = HTTPBearer()

admin_only_access = RoleAccess([Role.admin, ])

@admin_router.post("/user", response_model=UserResponseSchema, dependencies=[Depends(admin_only_access)], status_code=status.HTTP_201_CREATED)
async def signup(
            bt: BackgroundTasks, 
            request: Request,
            username: EmailStr = Form(...),
            password: str = Form(...),
            full_name: str = Form(...),
            role: str = Form(...),
            age: int = Form(...),
            gender: str = Form(...),
            img_profile: UploadFile = File(...),
            db: AsyncSession = Depends(get_db)
        ):

    exist_user = await repositories_users.get_user_by_email(username, db)
    if exist_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account already exists")
    
    max_size = 10 * 1024 * 1024  # 5 MB max file size
    allowed_extensions = ['.jpg', '.jpeg', '.png']
    if not any(img_profile.filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed formats are: jpg, jpeg, png.")
    
    if img_profile.size == 0:
        raise HTTPException(status_code=400, detail="File is empty.")

    # Read file in chunks
    current_size = 0
    chunk_size = 1024 * 1024
    while True:
        chunk = await img_profile.read(chunk_size)
        if not chunk:  # No more data to read
            break
        current_size += len(chunk)
        
        # Check if the file size exceeds the limit
        if current_size > max_size:
            raise HTTPException(status_code=400, detail="File size exceeds the allowed limit of 5MB.")
    img_profile.file.seek(0)
        
    password = auth_service.get_password_hash(password)
    img_profile = await cloudinary.upload_avatar_to_cloudinary(img_profile, username)
    print(img_profile)
    try:
        # Create an instance of UserCreationSchema
        user_data = UserCreationSchema(
            email=username,
            password=password,
            full_name=full_name,
            role=role,
            age=age,
            gender=gender,
            img_profile=img_profile
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data: {e}")
    
    new_user = await repositories_users.create_user(user_data, db)
    bt.add_task(send_email, new_user.email, new_user.full_name, str(request.base_url))
    return new_user


@admin_router.get("/all_users", response_model=List[UserResponseSchema], dependencies=[Depends(admin_only_access)], status_code=status.HTTP_200_OK)
async def get_all_users(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    users = await repositories_users.get_all_users_from_db(db)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users found."
        )
    return users

@admin_router.delete("/user", dependencies=[Depends(admin_only_access)], status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    request: Request,
    email: EmailStr = Query(..., description="Email of the user to delete"),
    db: AsyncSession = Depends(get_db)
):
    user = await repositories_users.get_user_by_email(email, db)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with email {email} not found")

    await repositories_users.delete_user(email, db)
    await cloudinary.delete_avatar_from_cloudinary(email)
    return

@admin_router.patch("/user", response_model=UserResponseSchema, dependencies=[Depends(admin_only_access)], status_code=status.HTTP_200_OK)
async def edit_user(
            bt: BackgroundTasks, 
            request: Request,
            email: EmailStr = Query(..., description="Email of the user to update"),
            password: str = Form(None),
            full_name: str = Form(None),
            role: str = Form(None),
            age: int = Form(None),
            gender: str = Form(None),
            img_profile: UploadFile = File(None),
            db: AsyncSession = Depends(get_db)
        ):
    user = await repositories_users.get_user_by_email(email, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if img_profile:
        max_size = 10 * 1024 * 1024  # 5 MB max file size
        allowed_extensions = ['.jpg', '.jpeg', '.png']
        if not any(img_profile.filename.endswith(ext) for ext in allowed_extensions):
            raise HTTPException(status_code=400, detail="Invalid file type. Allowed formats are: jpg, jpeg, png.")
        
        if img_profile.size == 0:
            raise HTTPException(status_code=400, detail="File is empty.")

        # Read file in chunks
        current_size = 0
        chunk_size = 1024 * 1024
        while True:
            chunk = await img_profile.read(chunk_size)
            if not chunk:  # No more data to read
                break
            current_size += len(chunk)
            
            # Check if the file size exceeds the limit
            if current_size > max_size:
                raise HTTPException(status_code=400, detail="File size exceeds the allowed limit of 5MB.")
        img_profile.file.seek(0)
        await cloudinary.delete_avatar_from_cloudinary(email)
        img_profile = await cloudinary.upload_avatar_to_cloudinary(img_profile, email)
    if password:
        password = auth_service.get_password_hash(password)

    update_data = {
        "full_name": full_name,
        "password": password,
        "role": role,
        "age": age,
        "gender": gender,
        "img_profile": img_profile,
    }

    # Filter out None values
    update_data = {k: v for k, v in update_data.items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

    updated_user = await repositories_users.update_user(email, update_data, db)
    return updated_user

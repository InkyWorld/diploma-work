from fastapi import APIRouter, HTTPException, Depends, Request, status, BackgroundTasks
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repository import user as repositories_users
from app.schemas.user import UserCreationSchema, UserResponseSchema
from app.core.security import auth_service
from app.services.email import send_email
from app.models.models import Role
from app.services.roles import RoleAccess

admin_router = APIRouter(prefix='/admin', tags=['admin'])
get_refresh_token = HTTPBearer()

admin_only_access = RoleAccess([Role.admin, ])


@admin_router.post("/signup", response_model=UserResponseSchema, dependencies=[Depends(admin_only_access)], status_code=status.HTTP_201_CREATED)
async def signup(body: UserCreationSchema, bt: BackgroundTasks, request: Request, db: AsyncSession = Depends(get_db)):
    """
    Sign up a new user.

    This endpoint allows a new user to create an account. If the email already exists, a conflict is raised.
    The password is hashed before being saved. A confirmation email is sent after the user is created.

    Args:
        body (UserCreationSchema): The user creation data, including email and password.
        bt (BackgroundTasks): Background tasks to handle email sending.
        request (Request): The HTTP request object to retrieve base URL for email.
        db (AsyncSession, optional): The database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: If the user already exists (409 Conflict).

    Returns:
        UserResponseSchema: The newly created user details.
    """
    exist_user = await repositories_users.get_user_by_email(body.email, db)
    if exist_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account already exists")
    body.password = auth_service.get_password_hash(body.password)
    new_user = await repositories_users.create_user(body, db)
    bt.add_task(send_email, new_user.email, new_user.full_name, str(request.base_url))
    return new_user
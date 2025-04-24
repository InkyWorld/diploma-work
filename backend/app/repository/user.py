from typing import List
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.users import Role, User
from app.schemas.user import UserCreationSchema
from sqlalchemy import delete, select

from app.core.config import admin_config
from app.core.security import auth_service
from datetime import datetime, timezone


async def get_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a user by their email address.

    This function queries the database to find a user by their email address.

    Args:
        email (str): The email address of the user.
        db (AsyncSession, optional): The database session. Defaults to Depends(get_db).

    Returns:
        User | None: The user object if found, or None if the user does not exist.
    """
    stmt = select(User).filter(User.email == email)
    user = await db.execute(stmt)
    user = user.scalar_one_or_none()
    return user


async def create_user(body: UserCreationSchema, db: AsyncSession = Depends(get_db)):
    """
    Create a new user in the database.

    This function creates a new user by extracting the data from the provided
    UserCreationSchema and saving it to the database.

    Args:
        body (UserCreationSchema): The user creation data, including email and password.
        db (AsyncSession, optional): The database session. Defaults to Depends(get_db).

    Returns:
        User: The newly created user object.
    """
    user = User(**body.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def update_token(user: User, token: str | None, db: AsyncSession):
    """
    Update the user's refresh token in the database.

    This function updates the user's refresh token with the new value provided.

    Args:
        user (User): The user object whose token is being updated.
        token (str | None): The new refresh token value. If None, the token will be cleared.
        db (AsyncSession): The database session to commit changes.
    """
    user.refresh_token = token
    await db.commit()


async def confirm_email(email: str, db: AsyncSession) -> None:
    """
    Confirm a user's email address.

    This function sets the 'verified' status of the user to True after verifying
    their email address.

    Args:
        email (str): The email address of the user to be confirmed.
        db (AsyncSession): The database session to commit changes.

    Returns:
        None: This function does not return any value.
    """
    user = await get_user_by_email(email, db)
    if user:
        user.verified = True
        await db.commit()
    return user if user else None


async def update_avatar_url(email: str, url: str | None, db: AsyncSession) -> User:
    """
    Update the avatar URL for a user identified by their email.

    Args:
        email (str): The email of the user whose avatar URL needs to be updated.
        url (str | None): The new avatar URL. If `None`, the avatar is removed.
        db (AsyncSession): The database session used to interact with the database.

    Returns:
        User: The updated user object with the new avatar URL.

    Raises:
        ValueError: If the user with the provided email is not found in the database.
    """
    user = await get_user_by_email(email, db)
    user.img_profile = url
    await db.commit()
    await db.refresh(user)
    return user

async def get_all_users_from_db(db: AsyncSession) -> List[User]:
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

async def delete_user(email, db: AsyncSession) -> List[User]:
    stmt = delete(User).where(User.email == email)
    await db.execute(stmt)
    await db.commit()
    

async def update_user(email, update_data, db: AsyncSession) -> User:
    user = await get_user_by_email(email, db)
    for key, value in update_data.items():
        if value is not None:
            setattr(user, key, value)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def create_admin(db: AsyncSession) -> User:
    # Check if admin already exists
    admin_user = await get_user_by_email(admin_config.ADMIN_EMAIL, db)

    if admin_user:
        print(f"Admin user {admin_config.ADMIN_EMAIL} already exists.")
        return admin_user
    admin_user = User(
        full_name=admin_config.ADMIN_FULLNAME,
        email=admin_config.ADMIN_EMAIL,
        password=auth_service.get_password_hash(admin_config.ADMIN_PASSWORD),
        verified=True,
        img_profile=admin_config.ADMIN_IMG_PROFILE,
        age=admin_config.ADMIN_AGE,
        gender=admin_config.ADMIN_GENDER,
        role=Role.admin,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.add(admin_user)
    await db.commit()
    await db.refresh(admin_user)
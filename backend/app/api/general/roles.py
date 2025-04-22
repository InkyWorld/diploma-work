from typing import List
from fastapi import APIRouter, File, Form, HTTPException, Depends, Query, Request, UploadFile, status, BackgroundTasks
from fastapi.security import HTTPBearer
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.repository import user as repositories_users
from app.schemas.user import UserCreationSchema, UserResponseSchema
from app.core.security import auth_service
from app.services.email import send_email
from app.models.models import Role
from app.services.roles import RoleAccess
from app.services.cloudinary import claudinary

admin_router = APIRouter(prefix='/admin', tags=['admin'])
get_refresh_token = HTTPBearer()

admin_only_access = RoleAccess([Role.admin, ])

@admin_router.post("/me", response_model=UserResponseSchema, dependencies=[Depends(admin_only_access)], status_code=status.HTTP_201_CREATED)
async def get_profile(
            request: Request,
            db: AsyncSession = Depends(get_db),
            Depends(auth_service.authenticate_user)
        ):

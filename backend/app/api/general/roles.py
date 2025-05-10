from fastapi import APIRouter, Depends, Request, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.user import UserMeSchema
from app.services.auth import auth_service
from app.models.users import Role
from app.services.roles import RoleAccessService


general_roles_router = APIRouter(prefix='/general', tags=['general'])
all_roles_access = RoleAccessService([role for role in Role])

@general_roles_router.get("/me", response_model=UserMeSchema, status_code=status.HTTP_200_OK)
async def get_profile(
            request: Request,
            user=Depends(auth_service.authenticate_user)
        ):
    return user
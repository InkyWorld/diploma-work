from typing import List
from datetime import date, datetime

from fastapi import APIRouter, Depends, Query, HTTPException, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.roles import RoleAccessService
from app.models.users import Role, User
from app.db.redis import get_redis
from app.db.database import get_db
from app.schemas.technician import ActiveEventSchema
from app.repository.technician import get_current_events, set_event_done

technician_only_access = RoleAccessService([Role.technician])
technician_router = APIRouter(
    prefix="/technician",
    tags=["technician"]
)

@technician_router.get("/get_events", response_model=List[ActiveEventSchema], status_code=status.HTTP_200_OK)
async def get_events(user: User = Depends(technician_only_access), redis: Redis = Depends(get_redis)):
    return await get_current_events(user.id, redis)

@technician_router.post("/mark_work_done", status_code=status.HTTP_200_OK)
async def mark_work_done(event_performance_number_identifier: int, user: User = Depends(technician_only_access), redis: Redis = Depends(get_redis), db:AsyncSession = Depends(get_db)):
    try:
        return await set_event_done(user, event_performance_number_identifier, redis, db)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")
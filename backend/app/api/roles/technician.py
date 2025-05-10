from typing import List
from datetime import date, datetime

from fastapi import APIRouter, Depends, Query, HTTPException, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.roles import RoleAccessService
from app.models.users import Role, User
from app.repository.shift_supervisor import get_shift_plan, update_shift_plan, set_worker_on_event as swe, get_workers
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
    if await set_event_done(user, event_performance_number_identifier, redis, db):
        return True
    else:
        return False
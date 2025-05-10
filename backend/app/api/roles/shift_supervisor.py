from typing import List
from datetime import date, datetime

from fastapi import APIRouter, Depends, Query, HTTPException, status, BackgroundTasks
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.roles import RoleAccessService
from app.models.users import Role
from app.schemas.shift_plan import AircraftDataResponseSchema
from app.repository.shift_supervisor import get_shift_plan as get_sp, update_shift_plan as shift_plan_update, set_worker_on_event as swe, get_workers
from app.models.enums import ShiftEnum 
from app.db.redis import get_redis
from app.db.database import get_db
from app.schemas.shift_supervisor import UserResponseSchema

shift_supervisor_only_access = RoleAccessService([Role.shift_supervisor])

shift_supervisor_router = APIRouter(
    prefix="/shift_supervisor",
    tags=["shift supervisor"]
)

@shift_supervisor_router.get("/shift_plan", response_model=List[AircraftDataResponseSchema], dependencies=[Depends(shift_supervisor_only_access)], status_code=status.HTTP_200_OK)
async def get_shift_plan(input_date: date, shift: ShiftEnum, redis: Redis = Depends(get_redis)):
    return await get_sp(input_date, shift, redis)

@shift_supervisor_router.get("/update_shift_plan", response_model=List[AircraftDataResponseSchema], dependencies=[Depends(shift_supervisor_only_access)], status_code=status.HTTP_200_OK)
async def update_shift_plan(input_date: date, shift: ShiftEnum, redis: Redis = Depends(get_redis)):
    return await shift_plan_update(input_date, shift, redis)

@shift_supervisor_router.post("/set_worker_on_event", dependencies=[Depends(shift_supervisor_only_access)], status_code=status.HTTP_201_CREATED)
async def set_worker_on_event(worker_ids: list[int], event_performance_number_identifier: int, redis: Redis = Depends(get_redis), db: AsyncSession = Depends(get_db)):
    try:
        await swe(worker_ids, event_performance_number_identifier, redis, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@shift_supervisor_router.get("/get_all_workers", response_model=List[UserResponseSchema], dependencies=[Depends(shift_supervisor_only_access)], status_code=status.HTTP_200_OK)
async def get_all_workers(db: AsyncSession = Depends(get_db)):
    user = await get_workers(db)
    return user

@shift_supervisor_router.get("/all_events_done_from_shift_plan", dependencies=[Depends(shift_supervisor_only_access)], status_code=status.HTTP_200_OK)
async def set_worker_on_event(input_date: date, shift: ShiftEnum, redis: Redis = Depends(get_redis), db: AsyncSession = Depends(get_db)):
    shift_plan = await get_sp(input_date, shift, redis)
    

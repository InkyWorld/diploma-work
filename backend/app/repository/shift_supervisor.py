from typing import List
from datetime import date, time

import orjson
from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.amos_gmail import service_gmail
from app.services.shift_plan_create import create_shift_plan, analyze_aircraft_presence_during_shift
from app.models.enums import ShiftEnum
from app.core import data_and_time_converter
from app.models.events import WorkEvent
from app.models.users import User, Role
from app.schemas.shift_plan import AircraftDataResponseSchema
from app.repository.user import get_users_by_ids

def serialize_shift_plan(plan):
    return [item.model_dump() for item in plan]

def deserialize_shift_plan(data: list) -> list[AircraftDataResponseSchema]:
    return [AircraftDataResponseSchema(**item) for item in data]

async def get_shift_plan(input_date: date, shift: ShiftEnum, redis: Redis):
    date_key = data_and_time_converter.convert_date_to_days(input_date)
    data = await redis.get(f"shift_plan:{date_key}:{shift}")
    if data:
        shift_plan_dict = orjson.loads(data)
        shift_plan = deserialize_shift_plan(shift_plan_dict)
    else:
        await service_gmail.update_amos_tables()
        raw_data = await analyze_aircraft_presence_during_shift(date_key, shift)
        shift_plan = await create_shift_plan(raw_data)
        serialized = serialize_shift_plan(shift_plan)
        await redis.set(
            f"shift_plan:{date_key}:{shift}",
            orjson.dumps(serialized, default=lambda o: o.model_dump())
        )
        await redis.expire(f"shift_plan:{date_key}:{shift}", 86400)
    return shift_plan


async def update_shift_plan(input_date: date, shift: ShiftEnum, redis: Redis):
    date_key = data_and_time_converter.convert_date_to_days(input_date)
    await service_gmail.update_amos_tables()
    raw_data = await analyze_aircraft_presence_during_shift(date_key, shift)
    shift_plan = await create_shift_plan(raw_data)
    serialized = serialize_shift_plan(shift_plan)
    await redis.delete(f"shift_plan:{date_key}:{shift}")
    await redis.set(
        f"shift_plan:{date_key}:{shift}",
        orjson.dumps(serialized, default=lambda o: o.model_dump())
    )
    await redis.expire(f"shift_plan:{date_key}:{shift}", 86400)
    return shift_plan

async def get_workers(db: AsyncSession):
    users = await db.execute(select(User).where(User.role == Role.technician))
    users = users.scalars().all()
    return users

async def set_worker_on_event(worker_ids: List[int], event_performance_number_identifier: int, redis: Redis, db: AsyncSession):
    users = await get_users_by_ids(worker_ids, db)
    if len(users) != len(worker_ids):
        missing_ids = set(worker_ids) - {user.id for user in users}
        raise ValueError(f"Some worker IDs not found in DB: {missing_ids}")
    events = await WorkEvent.find(
        WorkEvent.event_performance_number_identifier == event_performance_number_identifier
    ).all()
    if not events:
        raise ValueError(
            f"WorkEvent with identifier {event_performance_number_identifier} not found."
        )
    event = events[0]
    for user in users:
        await redis.set(f"workers_set_event:{user.id}:{event_performance_number_identifier}", event.model_dump_json())
        await redis.expire(f"workers_set_event:{user.id}:{event_performance_number_identifier}", 43200)

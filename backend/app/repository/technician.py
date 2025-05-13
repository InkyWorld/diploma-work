import json

from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.events import WorkEventCompleted
from app.models.users import User
from app.models.enums import ShiftEnum

async def get_worker_events_keys(worker_id: int, redis: Redis) -> list[str]:
    cursor = 0
    keys = []
    pattern = f"workers_set_event:{worker_id}:*"

    while True:
        cursor, batch = await redis.scan(cursor=cursor, match=pattern, count=100)
        keys.extend(batch)
        if cursor == 0:
            break

    return keys

async def get_worker_events_data(worker_id: int, redis: Redis) -> list[dict]:
    keys = await get_worker_events_keys(worker_id, redis)
    result = []

    for key in keys:
        value = await redis.get(key)
        if value:
            try:
                data = json.loads(value)
                result.append(data)
            except json.JSONDecodeError:
                result.append({"raw": value})

    return result

async def get_current_events(user_id: int, redis: Redis):
    return await get_worker_events_data(user_id, redis)


async def set_event_done(user: User, event_performance_number_identifier: int, shift: ShiftEnum, redis: Redis, db: AsyncSession):
    # Retrieve event data from Redis
    event_bytes = await redis.get(f"workers_set_event:{user.id}:{shift}:{event_performance_number_identifier}")
    if not event_bytes:
        raise ValueError("Event not found in Redis.")  # Generic exception

    event_str = event_bytes.decode("utf-8")
    event_dict = json.loads(event_str)
    event_id = event_dict.get("event_performance_number_identifier")

    if event_id is None:
        raise ValueError("Invalid event data.")

    # Check if the event is already completed in the database
    query = select(WorkEventCompleted).where(
        WorkEventCompleted.event_performance_number_identifier == event_id,
        WorkEventCompleted.worker_email == user.email
    )
    existing_record = await db.scalar(query)
    
    if existing_record:
        event_dict["completed"] = True
        await redis.set(f"workers_set_event:{user.id}:{shift}:{event_id}", json.dumps(event_dict))
        return existing_record

    # Create and save the completed event record
    event_completed = WorkEventCompleted(
        aircraft_name=event_dict.get("aircraft_code"),
        event_code=event_dict.get("event_code"),
        event_performance_number_identifier=event_id,
        worker_full_name=user.full_name,
        worker_email=user.email,
    )
    db.add(event_completed)
    await db.commit()
    await db.refresh(event_completed)

    # Mark the event as completed in Redis
    event_dict["completed"] = True
    await redis.set(f"workers_set_event:{user.id}:{shift}:{event_id}", json.dumps(event_dict))

    return event_completed
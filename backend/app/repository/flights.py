from typing import List
from datetime import datetime, timezone

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, and_

from app.core import config, log
from app.services.auth import auth_service
from app.models.flights import Flight
from app.schemas.flights import FlightFilter


async def get_flights_from_db_by_filter(
    filter: FlightFilter, db: AsyncSession
) -> List[Flight]:
    """
    Retrieve flights from the database based on the provided filter criteria.

    Args:
        filter (FlightFilter): The filter criteria.
        db (AsyncSession): The database session.

    Returns:
        List[Flight]: A list of flights that match the filter criteria.
    """
    filter_dict = filter.model_dump(exclude_none=True)  # Convert Pydantic model to dict
    stmt = select(Flight)

    # Add filters for departure date and time
    if filter.departure_date_from:
        stmt = stmt.filter(Flight.departure_date >= filter.departure_date_from)
    if filter.departure_date_to:
        stmt = stmt.filter(Flight.departure_date <= filter.departure_date_to)
    if filter.departure_time_from:
        stmt = stmt.filter(Flight.departure_time >= filter.departure_time_from)
    if filter.departure_time_to:
        stmt = stmt.filter(Flight.departure_time <= filter.departure_time_to)

    # Add filters for arrival date and time
    if filter.arrival_date_from:
        stmt = stmt.filter(Flight.arrival_date >= filter.arrival_date_from)
    if filter.arrival_date_to:
        stmt = stmt.filter(Flight.arrival_date <= filter.arrival_date_to)
    if filter.arrival_time_from:
        stmt = stmt.filter(Flight.arrival_time >= filter.arrival_time_from)
    if filter.arrival_time_to:
        stmt = stmt.filter(Flight.arrival_time <= filter.arrival_time_to)

    # Add other filters
    if filter.aircraft_name:
        stmt = stmt.filter(Flight.aircraft_name.ilike(f"%{filter.aircraft_name}%"))
    if filter.departure_airport:
        stmt = stmt.filter(Flight.departure_airport.ilike(f"%{filter.departure_airport}%"))
    if filter.flight_name:
        stmt = stmt.filter(Flight.flight_name.ilike(f"%{filter.flight_name}%"))
    if filter.service_class:
        stmt = stmt.filter(Flight.service_class.ilike(f"%{filter.service_class}%"))

    result = await db.execute(stmt)
    return result.scalars().all()


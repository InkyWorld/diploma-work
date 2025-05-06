from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from datetime import date, datetime
from app.services.roles import RoleAccessService
from app.models.users import Role
from app.schemas.flights import FutureFlightsResponseSchema
from app.models.enums import TransitEnum
from app.repository.flights import get_flight_arrival_by_date, get_flight_departure_by_date

flight_dispatcher_only_access = RoleAccessService([Role.flight_dispatcher])

flight_dispatcher_router = APIRouter(
    prefix="/flight_dispatcher",
    tags=["flight_dispatcher"]
)

@flight_dispatcher_router.get("/flights_arrival", response_model=List[FutureFlightsResponseSchema], dependencies=[Depends(flight_dispatcher_only_access)], status_code=status.HTTP_200_OK)
async def get_flights_by_date(
    start_date: date = Query(..., description="Start date in yyyy-mm-dd format"),
    end_date: date = Query(..., description="End date in yyyy-mm-dd format"),
    transit: TransitEnum = Query(..., description="Transit airport"),
):
    if transit == TransitEnum.arrival:
        return await get_flight_arrival_by_date(start_date, end_date)
    else:
        return await get_flight_departure_by_date(start_date, end_date)
    

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from datetime import date, datetime, time
from app.services.roles import RoleAccessService
from app.models.users import Role
from app.schemas.events import WorkEventResponseSchema
from app.schemas.packages import WorkPackageResponseSchema
from app.repository.events import get_work_events_by_criteria
from app.repository.packages import get_work_packages_by_criteria

engineer_only_access = RoleAccessService([Role.engineer])

engineer_dispatcher_router = APIRouter(
    prefix="/engineer",
    tags=["engineer"]
)
#dependencies=[Depends(engineer_only_access)]
@engineer_dispatcher_router.get("/event_report", response_model=List[WorkEventResponseSchema], status_code=status.HTTP_200_OK)
async def get_events_by_criteria(
    aircraft_code: Optional[str] = Query(None, description="Aircraft code"),
    work_package_number_identifier: Optional[int] = Query(None, description="Work package number identifier"),
    event_performance_number_identifier: Optional[int] = Query(None, description="Event performance number identifier"),
):
    if len([param for param in [aircraft_code, work_package_number_identifier, event_performance_number_identifier] if param is not None]) > 1:
        raise HTTPException(status_code=400, detail="Please provide only one of the following parameters or nothing: aircraft_code, work_package_number_identifier, event_performance_number_identifier")
    
    return await get_work_events_by_criteria(
        aircraft_code=aircraft_code,
        work_package_number_identifier=work_package_number_identifier,
        event_performance_number_identifier=event_performance_number_identifier
    )
    
@engineer_dispatcher_router.get("/packages", response_model=List[WorkPackageResponseSchema], status_code=status.HTTP_200_OK)
async def get_packages_by_criteria(
    package_number_internal: Optional[str] = Query(None, description="Internal package number"),
    aircraft_registration: Optional[str] = Query(None, description="Aircraft registration"),
    station: Optional[str] = Query(None, description="Station or airport code"),
    start_date: Optional[date] = Query(None, description="Start date in yyyy-mm-dd format"),
    start_time: Optional[time] = Query(None, description="Start time in hhmm or minutes after midnight"),
    end_date: Optional[date] = Query(None, description="End date in yyyy-mm-dd format"),
    end_time: Optional[time] = Query(None, description="End time in hhmm or minutes after midnight"),
):
    if not start_date and start_time or start_date and not start_time:
        raise HTTPException(status_code=400, detail="Not start_date and start_time or start_date and not start_time")
    if not end_date and end_time or end_date and not end_time:
        raise HTTPException(status_code=400, detail="Not end_date and end_time or end_date and not end_time")
    return await get_work_packages_by_criteria(
        package_number_internal=package_number_internal,
        aircraft_registration=aircraft_registration,
        station=station,
        start_date=start_date,
        start_time=start_time,
        end_date=end_date,
        end_time=end_time
    )
    

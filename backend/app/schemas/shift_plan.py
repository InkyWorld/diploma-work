from typing import List, Optional, TypedDict
from pydantic import BaseModel

from datetime import date, time

class EventResponseSchema(BaseModel):
    event_performance_number_identifier: int
    estimated_man_hours: float
    event_code: str
    event_display_description: str
    status: str
    completed: bool = False


class WorkPackageResponseSchema(BaseModel):
    package_number_internal: str
    package_number: str
    start_date: date
    start_time: time
    end_date: date
    end_time: time
    description: str
    status: int
    events: List[EventResponseSchema]


class TurnaroundResponseSchema(BaseModel):
    aircraft: Optional[str] = None
    arrived_date: Optional[date] = None
    arrived_time: Optional[time] = None
    arrived_flight_name: Optional[str] = None
    next_departure_date: Optional[date] = None
    next_departure_time: Optional[time] = None
    next_departure_flight_name: Optional[str] = None
    departure_within_shift: bool
    arrived_within_shift: bool


class AircraftDataResponseSchema(BaseModel):
    turnaround: TurnaroundResponseSchema
    work_package: List[WorkPackageResponseSchema]



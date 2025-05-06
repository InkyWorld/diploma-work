from datetime import date, time
from pydantic import BaseModel

class WorkEventResponseSchema(BaseModel):
    aircraft_code: str
    event_code: str
    work_package_number_identifier: int
    work_package_number: str
    event_performance_number_identifier: int
    event_display_description: str
    estimated_man_hours: float
    status: str

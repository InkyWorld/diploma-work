from datetime import date, time
from pydantic import BaseModel


class WorkPackageResponseSchema(BaseModel):
    package_number_internal: str
    package_number: str
    aircraft_registration: str
    station: str
    start_date: date
    start_time: time
    end_date: date
    end_time: time
    description: str
    status: int
from datetime import date, time
from pydantic import BaseModel
from typing import Optional


class FlightFilter(BaseModel):
    aircraft_name: Optional[str] = None
    departure_date_from: Optional[date] = None
    departure_date_to: Optional[date] = None
    departure_time_from: Optional[time] = None
    departure_time_to: Optional[time] = None
    departure_airport: Optional[str] = None
    arrival_date_from: Optional[date] = None
    arrival_date_to: Optional[date] = None
    arrival_time_from: Optional[time] = None
    arrival_time_to: Optional[time] = None
    flight_name: Optional[str] = None
    service_class: Optional[str] = None

    class Config:
        orm_mode = True
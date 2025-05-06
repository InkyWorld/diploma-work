from datetime import date, time
from pydantic import BaseModel

class FutureFlightsResponseSchema(BaseModel):
    aircraft_name: str
    departure_date: date
    departure_time: time
    departure_airport: str
    arrival_date: date
    arrival_time: time
    arrival_airport: str 
    flight_name: str
    service_class: str
    field1: int
    field2: int
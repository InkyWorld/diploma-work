from datetime import date, time

from aredis_om import HashModel, Field

from app.db.redis import redis_manager

class Flight(HashModel):
    aircraft_name: str
    departure_date: date
    departure_time: time
    departure_airport: str
    arrival_date: date
    arrival_time: time
    arrival_airport: str 
    flight_name: str
    service_class: str
    field1: int = Field(default=0)
    field2: int = Field(default=0)

    class Meta:
        database = redis_manager._redis_client
from datetime import date, time

from aredis_om import HashModel, Field

from app.db.redis import redis_manager

class Flight(HashModel):
    aircraft_name: str = Field(index=True)
    departure_date: int = Field(index=True)
    departure_time: int = Field(index=True)
    departure_airport: str = Field(index=True)
    arrival_date: int = Field(index=True)
    arrival_time: int = Field(index=True)
    arrival_airport: str = Field(index=True)
    flight_name: str
    service_class: str
    field1: int = Field(default=0)
    field2: int = Field(default=0)

    class Meta:
        database = redis_manager._redis_client

    
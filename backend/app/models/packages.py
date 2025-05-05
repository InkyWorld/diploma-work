from datetime import date, datetime, time
from aredis_om import HashModel, Field

from app.db.redis import redis_manager

class WorkPackage(HashModel):
    package_number_internal: str = Field(primary_key=True)
    package_number: str
    aircraft_registration: str
    station: str

    start_date: date
    start_time: time
    end_date: date
    end_time: time

    description: str
    status: int

    class Meta:
        database = redis_manager._redis_client
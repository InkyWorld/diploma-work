from datetime import date, datetime, time
from aredis_om import HashModel, Field

from app.db.redis import redis_manager

class WorkPackage(HashModel):
    package_number_internal: str = Field(primary_key=True)
    package_number: str  = Field(index=True)
    aircraft_registration: str = Field(index=True)
    station: str = Field(index=True)

    start_date: int = Field(index=True)
    start_time: int = Field(index=True)
    end_date: int = Field(index=True)
    end_time: int = Field(index=True)

    description: str
    status: int

    class Meta:
        database = redis_manager._redis_client
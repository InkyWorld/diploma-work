from datetime import date, time

from aredis_om import HashModel, Field

from app.db.redis import redis_manager

class WorkEvent(HashModel):

    aircraft_code: str = Field(index=True)
    event_code: str
    work_package_number_identifier: int = Field(index=True)
    work_package_number: str
    event_performance_number_identifier: int = Field(index=True)
    event_display_description: str
    estimated_man_hours: float
    status: str

    class Meta:
        database = redis_manager._redis_client
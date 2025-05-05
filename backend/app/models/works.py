from datetime import date, time

from aredis_om import HashModel, Field

from app.db.redis import redis_manager

class WorkEvent(HashModel):

    aircraft_code: str
    event_code: str
    work_package_number_identifier: int
    work_package_number: str
    event_performance_number_identifier: int
    event_display_description: str
    estimated_man_hours: str
    status: str

    class Meta:
        database = redis_manager._redis_client
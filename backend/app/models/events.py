from datetime import datetime

from aredis_om import HashModel, Field
from sqlalchemy import Boolean, String, Integer, DateTime, ForeignKey, Enum, Date, func
from sqlalchemy.orm import mapped_column, Mapped

from app.db.redis import redis_manager
from app.db.base import Base


class WorkEvent(HashModel):

    aircraft_code: str = Field(index=True)
    event_code: str
    work_package_number_identifier: int = Field(index=True)
    work_package_number: str
    event_performance_number_identifier: int = Field(index=True)
    event_display_description: str
    estimated_man_hours: float
    status: str
    completed: bool = False

    class Meta:
        database = redis_manager._redis_client

class WorkEventCompleted(Base):
    __tablename__ = "work_events_completed"
    id: Mapped[int] = mapped_column(primary_key=True)
    aircraft_name: Mapped[str] = mapped_column(String(15))
    event_code: Mapped[str] = mapped_column(String(127))
    event_performance_number_identifier: Mapped[int] = mapped_column(Integer())
    worker_full_name: Mapped[str] = mapped_column(String(255))
    worker_email: Mapped[str] = mapped_column(String(127))
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

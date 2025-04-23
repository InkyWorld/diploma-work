from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Float

from app.db.base import Base

class WorkEvent(Base):
    __tablename__ = 'work_events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    aircraft_code: Mapped[str] = mapped_column(String(10), nullable=False)
    event_code: Mapped[str] = mapped_column(String(255), nullable=False)
    work_package_number_identifier: Mapped[int] = mapped_column(Integer, nullable=False)
    work_package_number: Mapped[str] = mapped_column(String(50), nullable=False)
    event_performance_number_identifier: Mapped[int] = mapped_column(Integer, nullable=False)
    event_display_description: Mapped[str] = mapped_column(String(255), nullable=False)
    estimated_man_hours: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    status: Mapped[str] = mapped_column(String(1), nullable=False)
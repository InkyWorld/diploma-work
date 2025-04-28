from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Float

from app.db.base import Base

class WorkEvent(Base):
    __tablename__ = 'work_events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    aircraft_code: Mapped[str] = mapped_column(String(15), nullable=False)
    event_code: Mapped[str] = mapped_column(String(511), nullable=False)
    work_package_number_identifier: Mapped[int] = mapped_column(Integer, nullable=False)
    work_package_number: Mapped[str] = mapped_column(String(255), nullable=False)
    event_performance_number_identifier: Mapped[int] = mapped_column(Integer, nullable=False)
    event_display_description: Mapped[str] = mapped_column(String(511), nullable=False)
    estimated_man_hours: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(1), nullable=False)
import enum
from datetime import datetime, date

from sqlalchemy import Boolean, String, Integer, DateTime, ForeignKey, Enum, Date, Time, func
from sqlalchemy.orm import relationship, mapped_column, Mapped

from app.db.database import Base

class Flight(Base):
    __tablename__ = "flights"

    id: Mapped[int] = mapped_column(primary_key=True)
    aircraft_name: Mapped[str] = mapped_column(String(10), nullable=False)
    
    departure_date: Mapped[Date] = mapped_column(Date, nullable=False)
    departure_time: Mapped[Time] = mapped_column(Time, nullable=False)
    departure_airport: Mapped[str] = mapped_column(String(10), nullable=False)
    
    arrival_date: Mapped[Date] = mapped_column(Date, nullable=False)
    arrival_time: Mapped[Time] = mapped_column(Time, nullable=False)
    arrival_airport: Mapped[str] = mapped_column(String(10), nullable=False)
    
    flight_name: Mapped[str] = mapped_column(String(10), nullable=False)
    service_class: Mapped[str] = mapped_column(String(1), nullable=False)
    
    field1: Mapped[int] = mapped_column(Integer, default=0)
    field2: Mapped[int] = mapped_column(Integer, default=0)

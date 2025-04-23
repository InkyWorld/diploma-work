import enum
from datetime import datetime, date

from sqlalchemy import Boolean, String, Integer, DateTime, ForeignKey, Enum, Date, func
from sqlalchemy.orm import mapped_column, Mapped

from app.db.base import Base


class Role(str, enum.Enum):
    admin = "admin"
    engineer = "engineer"
    flight_dispatcher = "flight dispatcher"
    shift_supervisor = "shift supervisor"
    technician = "technician"

class Gender(str, enum.Enum):
    M = "M"
    F = "F"


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    img_profile: Mapped[str] = mapped_column(String(2000), nullable=True)
    refresh_token: Mapped[str] = mapped_column(String(255), nullable=True)
    age: Mapped[int] = mapped_column(Integer(), nullable=False)
    gender: Mapped[Enum] = mapped_column("gender", Enum(Gender), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    role: Mapped[Enum] = mapped_column(
        "role", Enum(Role), nullable=False
    )



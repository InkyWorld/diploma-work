from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Date, Time

from app.db.database import Base

class WorkPackage(Base):
    __tablename__ = 'work_packages'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    package_number_internal: Mapped[int] = mapped_column(Integer, nullable=False)
    package_number: Mapped[str] = mapped_column(String(50), nullable=False)
    aircraft_registration: Mapped[str] = mapped_column(String(10), nullable=False)
    station: Mapped[str] = mapped_column(String(10), nullable=False)

    start_date: Mapped[Date] = mapped_column(Date, nullable=False)
    start_time: Mapped[Time] = mapped_column(Time, nullable=False)
    end_date: Mapped[Date] = mapped_column(Date, nullable=False)
    end_time: Mapped[Time] = mapped_column(Time, nullable=False)  

    description: Mapped[str] = mapped_column(String(511), nullable=False)
    status: Mapped[int] = mapped_column(Integer, nullable=False)
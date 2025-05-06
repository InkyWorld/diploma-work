from dataclasses import dataclass
from datetime import date, datetime, time, timedelta

from .date_time import data_and_time_converter
from app.models.enums import ShiftEnum

@dataclass
class Shift:
    start_date: date
    end_date: date
    start_time: time
    end_time: time
    airport: str
    
class ShiftCalc:
    async def create_shift(self, shift_type: ShiftEnum, start_date: date, end_date: date, airport: str) -> Shift:
        if shift_type == "day":
            start_time = time(8, 0)    # 08:00
            end_time = time(20, 0)     # 20:00
        elif shift_type == "night":
            start_time = time(20, 0)   # 20:00
            end_time = time(8, 0)      # 08:00 (наступного дня)
        else:
            raise ValueError("Unknown shift type. Use 'day' or 'night'.")

        return Shift(
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
            airport=airport
        )

    async def is_object_in_shift(self, obj_datetime: datetime, obj_airport: str, shift: Shift) -> bool:
        if obj_airport != shift.airport:
            return False

        shift_start = datetime.combine(shift.start_date, shift.start_time)
        shift_end = datetime.combine(shift.end_date, shift.end_time)

        return shift_start <= obj_datetime <= shift_end
    
    async def duration_in_airport(self, obj_datetime_start, obj_datetime_end):
        return obj_datetime_end - obj_datetime_start
    
shift_calc = ShiftCalc()
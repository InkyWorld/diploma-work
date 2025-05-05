
from datetime import date, time, timedelta


class DateTimeConverter:
    @staticmethod
    def convert_minutes_to_time(minutes: int) -> time:
        # Calculate hours and minutes from the total minutes
        hours = minutes // 60
        mins = minutes % 60
        return time(hours, mins)
    
    @staticmethod
    def convert_days_to_date(days_since_1970: int) -> date:
        """Конвертирует количество дней с 1970-01-01 в объект даты."""
        base_date = date(1970, 1, 1)
        target_date = base_date + timedelta(days=days_since_1970)
        return target_date
    
    @staticmethod
    def convert_time_to_minutes(t: time) -> int:
        total_minutes = t.hour * 60 + t.minute
        return total_minutes
    
    @staticmethod
    def convert_date_to_days(d: date) -> int:
        base_date = date(1970, 1, 1)
        delta = d - base_date
        return delta.days
    
data_and_time_converter = DateTimeConverter()
from typing import List
from datetime import date

from app.models.flights import Flight
from app.core import data_and_time_converter


async def get_flight_arrival_by_date(
    start_date: str, end_date: str
) -> List[Flight]:
    start_ts = data_and_time_converter.convert_date_to_days(start_date)
    end_ts = data_and_time_converter.convert_date_to_days(end_date)
    results = await Flight.find((Flight.arrival_date >= start_ts) & (Flight.arrival_date <= end_ts)).all()
    for flight in results:
        flight.departure_date = data_and_time_converter.convert_days_to_date(flight.departure_date)
        flight.arrival_date = data_and_time_converter.convert_days_to_date(flight.arrival_date)
        flight.departure_time = data_and_time_converter.convert_minutes_to_time(flight.departure_time)
        flight.arrival_time = data_and_time_converter.convert_minutes_to_time(flight.arrival_time)
    return results


async def get_flight_departure_by_date(
    start_date: date, end_date: date
) -> List[Flight]:
    start_ts = data_and_time_converter.convert_date_to_days(start_date)
    end_ts = data_and_time_converter.convert_date_to_days(end_date)
    results = await Flight.find((Flight.departure_date >= start_ts) & (Flight.departure_date <= end_ts)).all()
    for flight in results:
        flight.departure_date = data_and_time_converter.convert_days_to_date(flight.departure_date)
        flight.arrival_date = data_and_time_converter.convert_days_to_date(flight.arrival_date)
        flight.departure_time = data_and_time_converter.convert_minutes_to_time(flight.departure_time)
        flight.arrival_time = data_and_time_converter.convert_minutes_to_time(flight.arrival_time)
    return results







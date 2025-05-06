from typing import List
from datetime import date, datetime, time, timedelta

import sys
import os


x = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(x)
print()
from app.models.enums import ShiftEnum
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



async def foo(start_date: int, shift: ShiftEnum):
    if shift == ShiftEnum.day:
        shift_start_minutes = start_date * 1440 + 8 * 60
        shift_end_minutes = start_date * 1440 + 20 * 60
    elif shift == ShiftEnum.night:
        shift_start_minutes = start_date * 1440 + 20 * 60
        shift_end_minutes = (start_date + 1) * 1440 + 8 * 60
    else:
        raise ValueError("Shift must be DAY or NIGHT")

    results = []
    processed_flights = set()

    arrivals = await Flight.find(Flight.arrival_airport == "KBP").all()
    departures = await Flight.find(Flight.departure_airport == "KBP").all()

    # --- 1. Обробка всіх прибуттів ---
    for arrival in arrivals:
        arrival_total_minutes = arrival.arrival_date * 1440 + arrival.arrival_time

        # Перевірка, чи прибуття під час або до зміни
        if shift_start_minutes <= arrival_total_minutes < shift_end_minutes:
            candidate_departures = [
                dep for dep in departures
                if dep.aircraft_name == arrival.aircraft_name and
                   (dep.departure_date * 1440 + dep.departure_time) > arrival_total_minutes
            ]
            candidate_departures.sort(key=lambda f: (f.departure_date, f.departure_time))

            if candidate_departures:
                for dep in candidate_departures:
                    dep_total_minutes = dep.departure_date * 1440 + dep.departure_time
                    if dep_total_minutes >= shift_end_minutes:
                        # Виліт після закінчення зміни
                        results.append({
                            "aircraft": arrival.aircraft_name,
                            "arrived": f"arrival_date={arrival.arrival_date}, arrival_time={arrival.arrival_time}",
                            "next_departure": f"departure_date={dep.departure_date}, departure_time={dep.departure_time}",
                            "flight_name": dep.flight_name,
                            "departure_within_shift": False,
                            "arrived_within_shift": True
                        })
                    elif shift_start_minutes <= dep_total_minutes < shift_end_minutes:
                        # Виліт під час зміни
                        results.append({
                            "aircraft": arrival.aircraft_name,
                            "arrived": f"arrival_date={arrival.arrival_date}, arrival_time={arrival.arrival_time}",
                            "next_departure": f"departure_date={dep.departure_date}, departure_time={dep.departure_time}",
                            "flight_name": dep.flight_name,
                            "departure_within_shift": True,
                            "arrived_within_shift": True
                        })
                    processed_flights.add(dep.flight_name)
            else:
                # Якщо не знайшлося вильоту після прибуття
                results.append({
                    "aircraft": arrival.aircraft_name,
                    "arrived": f"arrival_date={arrival.arrival_date}, arrival_time={arrival.arrival_time}",
                    "next_departure": "NONE",
                    "flight_name": "NONE",
                    "departure_within_shift": False,
                    "arrived_within_shift": True
                })
        
        # Якщо прибуття не входить в зміну
        else:
            results.append({
                "aircraft": arrival.aircraft_name,
                "arrived": f"arrival_date={arrival.arrival_date}, arrival_time={arrival.arrival_time}",
                "next_departure": "NONE",
                "flight_name": "NONE",
                "departure_within_shift": False,
                "arrived_within_shift": False
            })

    # --- 2. Обробка всіх вильотів без попереднього прибуття ---
    for dep in departures:
        dep_total_minutes = dep.departure_date * 1440 + dep.departure_time

        if dep.flight_name in processed_flights:
            continue

        prior_arrivals = [
            arr for arr in arrivals
            if arr.aircraft_name == dep.aircraft_name and
               (arr.arrival_date * 1440 + arr.arrival_time) < dep_total_minutes
        ]

        if not prior_arrivals:
            # Виліт без попереднього прибуття
            results.append({
                "aircraft": dep.aircraft_name,
                "arrived": "NONE",
                "next_departure": f"departure_date={dep.departure_date}, departure_time={dep.departure_time}",
                "flight_name": dep.flight_name,
                "departure_within_shift": shift_start_minutes <= dep_total_minutes < shift_end_minutes,
                "arrived_within_shift": False
            })
            processed_flights.add(dep.flight_name)

    return results


if __name__ == "__main__":
    import asyncio
    asyncio.run(foo(18050, ShiftEnum.day))
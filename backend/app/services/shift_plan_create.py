from app.models.enums import ShiftEnum
from app.models.flights import Flight
from app.models.packages import WorkPackage
from app.models.events import WorkEvent
from app.schemas.shift_plan import EventResponseSchema, TurnaroundResponseSchema, WorkPackageResponseSchema, AircraftDataResponseSchema
from app.core import data_and_time_converter

async def analyze_aircraft_presence_during_shift(start_date: int, shift: ShiftEnum):
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

    # --- 1. Обработка всех прибытий ---
    for arrival in arrivals:
        arrival_total_minutes = arrival.arrival_date * 1440 + arrival.arrival_time

        if arrival_total_minutes >= shift_end_minutes:
            continue
        # Проверка, входит ли прибытие в границы смены
        if shift_start_minutes <= arrival_total_minutes < shift_end_minutes:
            candidate_departures = [
                dep for dep in departures
                if dep.aircraft_name == arrival.aircraft_name and
                   (dep.departure_date * 1440 + dep.departure_time) > arrival_total_minutes
            ]
            candidate_departures.sort(key=lambda f: (f.departure_date, f.departure_time))

            if candidate_departures:
                # Выбираем только ближайший вылет
                dep = candidate_departures[0]
                dep_total_minutes = dep.departure_date * 1440 + dep.departure_time

                if dep_total_minutes >= shift_end_minutes:
                    # Вылет после окончания смены
                    results.append({
                        "aircraft": arrival.aircraft_name,
                        "arrived_date": data_and_time_converter.convert_days_to_date(arrival.arrival_date),
                        "arrived_time": data_and_time_converter.convert_minutes_to_time(arrival.arrival_time),
                        "arrived_flight_name": arrival.flight_name,
                        "next_departure_date": data_and_time_converter.convert_days_to_date(dep.departure_date),
                        "next_departure_time": data_and_time_converter.convert_minutes_to_time(dep.departure_time),
                        "next_departure_flight_name": dep.flight_name,
                        "departure_within_shift": False,
                        "arrived_within_shift": True
                    })
                elif shift_start_minutes <= dep_total_minutes < shift_end_minutes:
                    # Вылет во время смены
                    results.append({
                        "aircraft": arrival.aircraft_name,
                        "arrived_date": data_and_time_converter.convert_days_to_date(arrival.arrival_date),
                        "arrived_time": data_and_time_converter.convert_minutes_to_time(arrival.arrival_time),
                        "arrived_flight_name": arrival.flight_name,
                        "next_departure_date": data_and_time_converter.convert_days_to_date(dep.departure_date),
                        "next_departure_time": data_and_time_converter.convert_minutes_to_time(dep.departure_time),
                        "next_departure_flight_name": dep.flight_name,
                        "departure_within_shift": True,
                        "arrived_within_shift": True
                    })
                processed_flights.add(dep.flight_name)
            else:
                # Если не найден вылет после прибытия
                results.append({
                    "aircraft": arrival.aircraft_name,
                    "arrived_date": data_and_time_converter.convert_days_to_date(arrival.arrival_date),
                    "arrived_time": data_and_time_converter.convert_minutes_to_time(arrival.arrival_time),
                    "arrived_flight_name": arrival.flight_name,
                    "next_departure_date": None,
                    "next_departure_time": None,
                    "next_departure_flight_name": None,
                    "departure_within_shift": False,
                    "arrived_within_shift": True
                })
        else:
            # Если прибытие не входит в смену
            results.append({
                "aircraft": arrival.aircraft_name,
                "arrived_date": data_and_time_converter.convert_days_to_date(arrival.arrival_date),
                "arrived_time": data_and_time_converter.convert_minutes_to_time(arrival.arrival_time),
                "arrived_flight_name": arrival.flight_name,
                "next_departure_date": None,
                "next_departure_time": None,
                "next_departure_flight_name": None,
                "departure_within_shift": False,
                "arrived_within_shift": False
            })

    # --- 2. Обработка всех вылетов без предыдущего прибытия ---
    for dep in departures:
        dep_total_minutes = dep.departure_date * 1440 + dep.departure_time

        if dep.flight_name in processed_flights:
            continue

        prior_arrivals = [
            arr for arr in arrivals
            if arr.aircraft_name == dep.aircraft_name and
               (arr.arrival_date * 1440 + arr.arrival_time) < dep_total_minutes
        ]

        if not prior_arrivals and dep_total_minutes > shift_start_minutes:
            # Вылет без предыдущего прибытия
            results.append({
                "aircraft": dep.aircraft_name,
                "arrived_date": None,
                "arrived_time": None,
                "next_departure_date": data_and_time_converter.convert_days_to_date(dep.departure_date),
                "next_departure_time": data_and_time_converter.convert_minutes_to_time(dep.departure_time),
                "next_departure_flight_name": dep.flight_name,
                "departure_within_shift": shift_start_minutes <= dep_total_minutes < shift_end_minutes,
                "arrived_within_shift": False
            })
            processed_flights.add(dep.flight_name)

    return results


async def create_shift_plan(aircraft_activity: list[TurnaroundResponseSchema]) -> list[AircraftDataResponseSchema]:
    result: list[AircraftDataResponseSchema] = []
    for turnaround in aircraft_activity:
        wps = await WorkPackage.find((WorkPackage.station == "KBP") & (WorkPackage.aircraft_registration == turnaround['aircraft'])).all()
        packages_result = []
        for wp in wps:
            events_result = []
            events = await WorkEvent.find(WorkEvent.work_package_number_identifier == wp.package_number_internal).all()
            if not events:
                continue
            events_result = [
                EventResponseSchema(
                    event_performance_number_identifier=event.event_performance_number_identifier,
                    estimated_man_hours=event.estimated_man_hours,
                    event_code=event.event_code,
                    event_display_description=event.event_display_description,
                    status=event.status
                )
                for event in events
            ]

            packages_result.append(
                WorkPackageResponseSchema(
                    package_number_internal=wp.package_number_internal,
                    package_number=wp.package_number,
                    start_date=data_and_time_converter.convert_days_to_date(wp.start_date),
                    start_time=data_and_time_converter.convert_minutes_to_time(wp.start_time),
                    end_date=data_and_time_converter.convert_days_to_date(wp.end_date),
                    end_time=data_and_time_converter.convert_minutes_to_time(wp.end_time),
                    description=wp.description,
                    status=wp.status,
                    events=events_result
                )
            )
        if packages_result:
            result.append(AircraftDataResponseSchema(
                turnaround=TurnaroundResponseSchema(**turnaround),
                work_package=packages_result
            ))

    return result


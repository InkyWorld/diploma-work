from datetime import date, time
from functools import reduce
from operator import and_
from typing import List, Optional

from app.models.packages import WorkPackage
from app.core import data_and_time_converter

async def get_work_packages_by_criteria(
        package_number_internal: Optional[str] = None,
        aircraft_registration: Optional[str] = None,
        station: Optional[str] = None,
        start_date: Optional[date] = None,
        start_time: Optional[time] = None,
        end_date: Optional[date] = None,
        end_time: Optional[time] = None
    ) -> List[WorkPackage]:
    filters = []

    if package_number_internal:
        filters.append(WorkPackage.package_number_internal == package_number_internal)

    if aircraft_registration:
        filters.append(WorkPackage.aircraft_registration == aircraft_registration)

    if station:
        filters.append(WorkPackage.station == station)

    if start_date and start_time:
        start_date = data_and_time_converter.convert_date_to_days(start_date)
        start_time = data_and_time_converter.convert_time_to_minutes(start_time)
        filters.append(WorkPackage.start_date >= start_date)
        
    if end_date and end_time:
        end_date = data_and_time_converter.convert_date_to_days(end_date)
        end_time = data_and_time_converter.convert_time_to_minutes(end_time)
        filters.append(WorkPackage.end_date <= end_date)
        
    
    if len(filters) == 1:
        packages = await WorkPackage.find(filters[0]).all()

    elif len(filters) > 1:
        combined_filter = reduce(and_, filters)
        packages = await WorkPackage.find(combined_filter).all()

    else:
        packages = await WorkPackage.find().all()
    
    result = []
    for package in packages:
        if package.start_date == start_date and package.start_time < start_time:
            continue

        if package.end_date == end_date and package.end_time > end_time:
            continue

        package.start_date = data_and_time_converter.convert_days_to_date(package.start_date)
        package.end_date = data_and_time_converter.convert_days_to_date(package.end_date)
        package.start_time = data_and_time_converter.convert_minutes_to_time(package.start_time)
        package.end_time = data_and_time_converter.convert_minutes_to_time(package.end_time)
        result.append(package)

    return result
    

    
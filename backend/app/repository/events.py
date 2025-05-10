from functools import reduce
from operator import and_
from typing import List, Optional

from app.models.events import WorkEvent


async def get_work_events_by_criteria(
        aircraft_code: Optional[str] = None,
        work_package_number_identifier: Optional[int] = None,
        event_performance_number_identifier: Optional[int] = None
    ) -> List[WorkEvent]:

    filters = []

    if aircraft_code:
        filters.append(WorkEvent.aircraft_code == aircraft_code)

    if work_package_number_identifier:
        filters.append(WorkEvent.work_package_number_identifier == work_package_number_identifier)

    if event_performance_number_identifier:
        filters.append(WorkEvent.event_performance_number_identifier == event_performance_number_identifier)
    
    if len(filters) == 1:
        events = await WorkEvent.find(filters[0]).all()
    elif len(filters) > 1:
        combined_filter = reduce(and_, filters)
        events = await WorkEvent.find(combined_filter).all()
    else:
        events = await WorkEvent.find().all()

    return events

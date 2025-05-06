

from operator import and_
from typing import List, Optional

from app.models.events import WorkEvent
from app.core import data_and_time_converter


async def get_work_events_by_criteria(
        aircraft_code: Optional[str] = None,
        work_package_number_identifier: Optional[int] = None,
        event_performance_number_identifier: Optional[int] = None
    ) -> List[WorkEvent]:
    if not any([aircraft_code, work_package_number_identifier, event_performance_number_identifier]):
        query = await WorkEvent.find()

    if aircraft_code:
        query = WorkEvent.find(WorkEvent.aircraft_code == aircraft_code)

    if work_package_number_identifier:
        query = WorkEvent.find(WorkEvent.work_package_number_identifier == work_package_number_identifier)

    if event_performance_number_identifier:
        query = WorkEvent.find(WorkEvent.status == event_performance_number_identifier)
    
    return await query.all()
    
import csv
from datetime import date, time, timedelta
from io import StringIO
from typing import Dict, List

from fastapi import HTTPException, status
from redis.asyncio.client import Redis
from app.models.flights import Flight
from app.models.events import WorkEvent
from app.models.packages import WorkPackage
from app.core import log

class FileDataHandler:
    def __init__(self):
        pass
    
    async def _save_to_redis(self, rows: List[Dict], model_class, redis: Redis):
        pipe = redis.pipeline()
        for row in rows:
            instance = model_class(**row)
            await instance.save(pipeline=pipe)
        await pipe.execute()

    async def _parse_csv(self, file_data: bytes, delimiter: str = ';') -> List[Dict]:
        decoded_data = file_data.decode('utf-8')
        f = StringIO(decoded_data)
        reader = csv.DictReader(f, delimiter=delimiter)
        return list(reader)

    async def save_flights_file(self, file_data: bytes, redis: Redis):
        try:
            rows = await self._parse_csv(file_data)
            prepared_rows = [await self.prepare_data(row, Flight) for row in rows]
            await self._save_to_redis(prepared_rows, Flight, redis)
        
        except Exception as e:
            log.error(f"Error saving flight data: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save flight data to database: {e}"
            )

    async def save_events_file(self, file_data: bytes, redis: Redis):
        try:
            rows = await self._parse_csv(file_data)
            prepared_rows = [await self.prepare_data(row, WorkEvent) for row in rows]
            await self._save_to_redis(prepared_rows, WorkEvent, redis)
        
        except Exception as e:
            log.error(f"Error saving event data: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save event data to database: {e}"
            )

    async def save_packages_file(self, file_data: bytes, redis: Redis):
        try:
            rows = await self._parse_csv(file_data)
            prepared_rows = [await self.prepare_data(row, WorkPackage) for row in rows]
            await self._save_to_redis(prepared_rows, WorkPackage, redis)
        
        except Exception as e:
            log.error(f"Error saving package data: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save package data to database: {e}"
            )
    
    async def prepare_data(self, row: Dict[str, str], model_class):
        if model_class == Flight:
            return {
                'aircraft_name': row['Flight_Code'],
                'departure_date': int(row['Departure_Date']),
                'departure_time': int(row['Departure_Time']),
                'departure_airport': row['Departure_Code'],
                'arrival_date': int(row['Arrival_Date']),
                'arrival_time': int(row['Arrival_Time']),
                'arrival_airport': row['Arrival_Code'],
                'flight_name': row['Flight_Number'],
                'service_class': row['Flight_Type'],
                'field1': int(row['Field_1']),
                'field2': int(row['Field_2'])
            }
        elif model_class == WorkEvent:
            return {
                'aircraft_code': row['Ac'],
                'event_code': row['Event'],
                'work_package_number_identifier': int(row['wpno_i']),
                'work_package_number': row['wpno'],
                'event_performance_number_identifier': int(row['event_perfno_i']),
                'event_display_description': row['event_display'],
                'estimated_man_hours': row['est_mh'],
                'status': row['status']
            }
        elif model_class == WorkPackage:
            return {
                'package_number_internal': row['wpno_i'],
                'package_number': row['wpno'],
                'aircraft_registration': row[' ac_registr'],
                'station': row['station'],
                'start_date': int(row['start_date']),
                'start_time': int(row['start_time']),
                'end_date': int(row['end_date']),
                'end_time': int(row['end_time']),
                'description': row['description'],
                'status': int(row['status'])
            }
        return {}
    
    async def delete_all_data(self, redis: Redis):
        try:
            pipe = redis.pipeline()
            await Flight.delete_many(models={}, pipeline=pipe)
            await WorkEvent.delete_many(models={}, pipeline=pipe)
            await WorkPackage.delete_many(models={}, pipeline=pipe)
            await pipe.execute()
            log.info("Все данные успешно удалены.")
        except Exception as e:
            log.error(f"Ошибка при удалении данных: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ошибка при удалении всех данных: {e}"
            )
    
amos_file_handler = FileDataHandler()
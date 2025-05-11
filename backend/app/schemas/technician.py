from datetime import datetime
from pydantic import BaseModel, EmailStr

class WorkEventCompletedSchema(BaseModel):
    aircraft_name: str
    event_code: str
    event_performance_number_identifier: str
    worker_full_name: str
    worker_email: EmailStr
    completed_at: datetime

class ActiveEventSchema(BaseModel):
    event_performance_number_identifier: int
    event_code: str
    event_display_description: str
    status: str
    completed: bool

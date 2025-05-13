from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr



class UserResponseSchema(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    img_profile: str

    model_config = ConfigDict(from_attributes=True, extra="ignore")

class EventSchema(BaseModel):
    aircraft_code: str
    event_code: str
    work_package_number_identifier: int
    work_package_number: str
    event_performance_number_identifier: int
    event_display_description: str
    estimated_man_hours: float
    status: str
    completed: int

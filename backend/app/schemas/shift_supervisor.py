from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr



class UserResponseSchema(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    img_profile: str

    model_config = ConfigDict(from_attributes=True, extra="ignore")


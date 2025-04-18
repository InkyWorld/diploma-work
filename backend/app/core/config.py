import os
from pathlib import Path
from typing import Optional
from pydantic import ConfigDict, EmailStr
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = ConfigDict(
        extra="ignore",
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding="utf-8",
    )

class DBConfig(Settings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:111111@localhost:5432/abc"


db_config = DBConfig()
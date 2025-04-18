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

class JWTConfig(Settings):
    SECRET_KEY: str = "1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_TOKEN_EXPIRE_DAYS: int = 7

class RedisConfig(Settings):
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0


config_redis = RedisConfig()
db_config = DBConfig()
jwt_config = JWTConfig()

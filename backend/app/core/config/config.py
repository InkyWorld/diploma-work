import json
from typing import Optional
from pydantic import EmailStr, field_validator

from app.core.config.base_config import Settings
from app.models.users import Gender
from app.core.logger.logger import logger
from app.core.config.base_config import BASE_DIR

logger.debug(f"BASE_DIR: {BASE_DIR}")

class DBConfig(Settings):
    DATABASE_URL: str


class JWTConfig(Settings):
    SECRET_KEY: str = "1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_TOKEN_EXPIRE_DAYS: int = 7


class RedisConfig(Settings):
    REDIS_HOST: str
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0


class EmailConfig(Settings):
    MAIL_USERNAME: EmailStr = "email@meail.com"
    MAIL_PASSWORD: str = "password"
    MAIL_FROM: str = "user"
    MAIL_PORT: int = 465
    MAIL_SERVER: str = "server"
    MAIL_FROM_NAME: str = "example"
    MAIL_STARTTLS: bool = False
    MAIL_SSL_TLS: bool = True
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

class CloudinaryConfig(Settings):
    CLOUDINARY_CLOUD_NAME: str = "abc"
    CLOUDINARY_API_KEY: str = "326488457974591"
    CLOUDINARY_API_SECRET: str = "secret"

class GmailConfig(Settings):
    GMAIL_CLIENT_TOKEN: dict = '{"installed": "client_token"}'
    GMAIL_FROM_EMAIL: str = "example@gmail.com"
    GMAIL_LETTER_SUBJECT: str = "Test letter from FastAPI"
    
    @field_validator("GMAIL_CLIENT_TOKEN", mode="before")
    def parse_json(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

class AdminConfig(Settings):
    ADMIN_PASSWORD: str = "admin"
    ADMIN_FULLNAME: str = "Admin User Ampss"
    ADMIN_AGE: int = 30
    ADMIN_GENDER: Gender = Gender.M
    ADMIN_EMAIL: str ="admin@example.com"
    ADMIN_IMG_PROFILE: str = "https://example.com/image.jpg"

admin_config = AdminConfig()
gmail_config = GmailConfig()
email_config = EmailConfig()
config_redis = RedisConfig()
cloudinary_config = CloudinaryConfig()
db_config = DBConfig()
jwt_config = JWTConfig()

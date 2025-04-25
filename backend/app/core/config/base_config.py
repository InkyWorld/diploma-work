from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[4]

# Путь к токену
TOKEN_PATH = BASE_DIR / 'secrets' / 'token.json'

# Логирование
LOGS_DIR = BASE_DIR / 'backend' / 'logs'
INFO_LOG_FILE = LOGS_DIR / 'app.log'
ERROR_LOG_FILE = LOGS_DIR / 'error.log'
WARNING_LOG_FILE = LOGS_DIR / 'warning.log' 
DEBUG_LOG_FILE = LOGS_DIR / 'debug.log'


# Прочие конфигурации
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

import os

from pydantic_settings import BaseSettings
from pydantic import ConfigDict
# pydantic from .env
class Settings(BaseSettings):
    model_config = ConfigDict(
        extra="ignore",
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding="utf-8",
    )
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not os.path.exists(os.path.join(BASE_DIR, ".env")):
            raise Exception(".env file not found. Using default or system environment variables.")


class AppConfig(Settings):
    DEBUG: bool = False

app_config = AppConfig()

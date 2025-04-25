import logging
import os
from app.core.config.base_config import app_config, INFO_LOG_FILE, ERROR_LOG_FILE, WARNING_LOG_FILE, DEBUG_LOG_FILE, LOGS_DIR


class ErrorTypeFilter(logging.Filter):
    """
    Фильтр для логгера, который пропускает только сообщения определенного типа.
    """
    def __init__(self, allowed_levels):
        super().__init__()
        self.allowed_levels = allowed_levels

    def filter(self, record):
        return record.levelname in self.allowed_levels

def setup_logger():
    os.makedirs(LOGS_DIR, exist_ok=True)
    logger = logging.getLogger("backend_app_logger")
    if app_config.DEBUG:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    # Формат логов
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # Логирование в файл для обычных сообщений (информация)
    info_file_handler = logging.FileHandler(INFO_LOG_FILE, encoding='utf-8')
    info_file_handler.setLevel(logging.INFO)
    info_file_handler.setFormatter(formatter)
    info_file_handler.addFilter(ErrorTypeFilter(["INFO"]))

    # Логирование ошибок в отдельный файл
    error_file_handler = logging.FileHandler(ERROR_LOG_FILE, encoding='utf-8')
    error_file_handler.setLevel(logging.ERROR)
    error_file_handler.setFormatter(formatter)
    error_file_handler.addFilter(ErrorTypeFilter(["ERROR"]))

    # Логирование предупреждений в отдельный файл
    warning_file_handler = logging.FileHandler(WARNING_LOG_FILE, encoding='utf-8')
    warning_file_handler.setLevel(logging.WARNING)
    warning_file_handler.setFormatter(formatter)
    warning_file_handler.addFilter(ErrorTypeFilter(["WARNING"]))

    # Консольный логгер
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    # Логирование отладочных сообщений в отдельный файл
    debug_file_handler = logging.FileHandler(DEBUG_LOG_FILE, encoding='utf-8')
    debug_file_handler.setLevel(logging.DEBUG)
    debug_file_handler.setFormatter(formatter)
    debug_file_handler.addFilter(ErrorTypeFilter(["DEBUG"]))

    # Добавление хендлеров
    logger.addHandler(info_file_handler)
    logger.addHandler(error_file_handler)
    logger.addHandler(warning_file_handler)
    logger.addHandler(console_handler)
    # Если отладка включена, добавляем обработчик для debug логов
    if app_config.DEBUG:
        logger.addHandler(debug_file_handler)

    return logger

# Создаем логгер
logger = setup_logger()

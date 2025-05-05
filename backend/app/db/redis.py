import contextlib

from aredis_om import get_redis_connection, Migrator

from app.core import config, log


class RedisSessionManager:
    def __init__(self, host: str, port: int, db: int, password: str | None = None):
        self._redis_url = f"redis://:{password}@{host}:{port}/{db}" if password else f"redis://{host}:{port}/{db}"
        self._redis_client = get_redis_connection(url=self._redis_url, decode_responses=False)

    async def connect_check(self):
        """Optional method to check connection explicitly"""
        try:
            await self._redis_client.ping()
        except Exception as e:
            log.error(f"Error connecting to Redis: {e}")
            
    async def close(self):
        if self._redis_client:
            await self._redis_client.close()
    
    async def apply_migrations(self):
        await Migrator().run()

    @contextlib.asynccontextmanager
    async def session(self):
        if self._redis_client is None:
            log.error("Redis client is not initialized")
            raise Exception("Redis is not initialized")
        yield self._redis_client


# Creating global Redis session manager
redis_manager = RedisSessionManager(
    host=config.config_redis.REDIS_HOST,
    port=config.config_redis.REDIS_PORT,
    db=config.config_redis.REDIS_DB,
    password=config.config_redis.REDIS_PASSWORD
)


async def get_redis():
    """Dependency function to get Redis session in FastAPI"""
    async with redis_manager.session() as redis:
        yield redis
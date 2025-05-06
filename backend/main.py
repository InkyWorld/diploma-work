from contextlib import asynccontextmanager
import time
from typing import AsyncGenerator

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_limiter import FastAPILimiter
import redis.asyncio as redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.users import Role, User
from app.api.auth.auth import auth_router
from app.api.roles.admin import admin_router
from app.api.general.roles import general_roles_router
from app.api.general.check import general_check_router
from app.services import RoleAccessService
from app.db.redis import redis_manager
from app.repository.user import create_admin
from app.db.database import sessionmanager
from app.core import log
from app.api.roles.flight_dispatcher import flight_dispatcher_router
from app.api.roles.engineer import engineer_dispatcher_router

admin_access = RoleAccessService([Role.admin])


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan function for managing the startup and shutdown lifecycle of the FastAPI application.

    This function is used to initialize and clean up the Redis connection and setup
    the FastAPILimiter during the application's lifespan. It connects to Redis
    when the app starts and closes the connection when the app shuts down.

    Args:
        app (FastAPI): The FastAPI application instance that will use this lifespan manager.

    Yields:
        None: This is a context manager, and the yielded value is unused. It simply
        marks the point where the application is running.

    Example:
        ```python
        app = FastAPI(lifespan=lifespan)
        ```
    """
    log.info("App starting up...")

    await redis_manager.connect_check()
    log.info("Redis connection established")
    await redis_manager.apply_migrations()
    log.info("Redis migrations applied")
    async with sessionmanager.session() as db:
        await create_admin(db)
    # Отримуємо сесію Redis для FastAPILimiter
    async with redis_manager.session() as redis:
        await FastAPILimiter.init(redis)
        log.info("FastAPILimiter initialized")

    yield
    log.info("App shutting down...")
    await redis_manager.close()
    log.info("Redis connection closed")
    await FastAPILimiter.close()
    log.info("FastAPILimiter closed")


app = FastAPI(
    debug=True,
    lifespan=lifespan,
    title="Aircraft maintenance procedures support system",
    version="1.0",
    description="🚀FastAPI backend application🚀",
)


origins = [
    "http://localhost",  # Дозволяє запити з localhost
    "http://localhost:3000",  # frontend
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(general_roles_router, prefix="/api")
app.include_router(general_check_router, prefix="/api")
app.include_router(
    flight_dispatcher_router, prefix="/api", tags=["flight_dispatcher"]
)
app.include_router(
    engineer_dispatcher_router, prefix="/api", tags=["engineer"]
)



if __name__ == "__main__":
    import uvicorn
    from app.core.utils.get_token import get_token_from_client_token
    get_token_from_client_token()
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_limiter import FastAPILimiter
import redis.asyncio as redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.users import Role
from app.api.auth.auth import auth_router
from app.api.roles.admin import admin_router
from app.api.general.roles import general_roles_router
from app.api.general.check import general_check_router
from app.services.roles import RoleAccess
from app.db.redis import redis_manager

admin_access = RoleAccess([Role.admin])


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
    print("App starting up...")

    await redis_manager.connect()
    # Отримуємо сесію Redis для FastAPILimiter
    async with redis_manager.session() as redis:
        await FastAPILimiter.init(redis)

    yield
    print("App shutting down...")
    await redis_manager.close()
    await FastAPILimiter.close()


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


if __name__ == "__main__":
    import uvicorn
    from app.utils.get_token import get_token_from_client_token
    get_token_from_client_token()
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
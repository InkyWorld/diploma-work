from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.api.roles.shift_supervisor import shift_supervisor_router, shift_supervisor_only_access
from app.db.base import Base
from app.db.database import get_db
from app.db.redis import get_redis
from app.models.enums import ShiftEnum
from app.models.users import Gender, Role, User

ASSIGNMENT_TTL = 43200


class FakeRedis:
    def __init__(self) -> None:
        self.store: dict[str, int] = {}
        self.expirations: dict[str, int] = {}
        self.operations: list[tuple[str, str, int]] = []

    async def set(self, key: str, value: int) -> None:
        self.store[key] = value
        self.operations.append(("set", key, value))

    async def expire(self, key: str, ttl: int) -> None:
        self.expirations[key] = ttl
        self.operations.append(("expire", key, ttl))




async def create_user(session_factory: async_sessionmaker, *, email: str, role: Role) -> User:
    """Persist a user entity in the ephemeral sqlite database."""
    async with session_factory() as session:
        user = User(
            full_name=email.split("@")[0],
            email=email,
            password="hashed",
            verified=True,
            img_profile=None,
            refresh_token=None,
            age=30,
            gender=Gender.M,
            role=role,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


@pytest_asyncio.fixture
async def integration_context(monkeypatch):
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    redis_double = FakeRedis()
    event_dump = "{\"event\": \"dummy\"}"

    class _MockEvent:
        def model_dump_json(self) -> str:
            return event_dump

    class _EventQuery:
        async def all(self):
            return [_MockEvent()]

    from app.models.events import WorkEvent as WorkEventModel

    def _fake_find(cls, *_, **__):
        return _EventQuery()

    monkeypatch.setattr(WorkEventModel, "find", classmethod(_fake_find))

    app = FastAPI()
    app.include_router(shift_supervisor_router, prefix="/api")

    async def override_get_db():
        async with session_factory() as session:
            yield session

    async def override_get_redis():
        yield redis_double

    async def override_role_access():
        return SimpleNamespace(id=999, role=Role.shift_supervisor)

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_redis] = override_get_redis
    app.dependency_overrides[shift_supervisor_only_access] = override_role_access

    yield SimpleNamespace(app=app, session_factory=session_factory, redis=redis_double, event_dump=event_dump)

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.mark.asyncio
async def test_set_worker_on_event_full_flow(integration_context):
    ctx = integration_context
    tech_a = await create_user(ctx.session_factory, email="tech_a@example.com", role=Role.technician)
    tech_b = await create_user(ctx.session_factory, email="tech_b@example.com", role=Role.technician)

    payload = {
        "worker_ids": [tech_a.id, tech_b.id],
        "shift": ShiftEnum.day.value,
        "event_performance_number_identifier": 1,
    }

    transport = ASGITransport(app=ctx.app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )

    assert response.status_code == 201, response.json()

    shift_token = str(ShiftEnum(payload["shift"]))
    expected_keys = [
        f"workers_set_event:{tech_a.id}:{shift_token}:1",
        f"workers_set_event:{tech_b.id}:{shift_token}:1",
    ]
    assert sorted(ctx.redis.store.keys()) == sorted(expected_keys)
    for key in expected_keys:
        assert ctx.redis.store[key] == ctx.event_dump
        assert ctx.redis.expirations[key] == ASSIGNMENT_TTL


@pytest.mark.asyncio
async def test_set_worker_on_event_rejects_non_technicians(integration_context):
    ctx = integration_context
    engineer = await create_user(ctx.session_factory, email="eng@example.com", role=Role.engineer)

    payload = {
        "worker_ids": [engineer.id],
        "shift": ShiftEnum.night.value,
        "event_performance_number_identifier": 55,
    }

    transport = ASGITransport(app=ctx.app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )

    assert response.status_code == 400, response.json()
    assert ctx.redis.store == {}
    assert ctx.redis.expirations == {}


@pytest.mark.asyncio
async def test_set_worker_on_event_mixed_roles_abort(integration_context):
    ctx = integration_context
    tech = await create_user(ctx.session_factory, email="tech_valid@example.com", role=Role.technician)
    engineer = await create_user(ctx.session_factory, email="eng_invalid@example.com", role=Role.engineer)

    payload = {
        "worker_ids": [tech.id, engineer.id],
        "shift": ShiftEnum.day.value,
        "event_performance_number_identifier": 77,
    }

    transport = ASGITransport(app=ctx.app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )

    assert response.status_code == 400, response.json()
    assert ctx.redis.store == {}


@pytest.mark.asyncio
async def test_set_worker_on_event_missing_users(integration_context, monkeypatch):
    ctx = integration_context

    async def fake_get_users_by_ids(*_, **__):
        raise ValueError("users not found")

    monkeypatch.setattr("app.api.roles.shift_supervisor.get_users_by_ids", fake_get_users_by_ids)

    payload = {
        "worker_ids": [999],
        "shift": ShiftEnum.day.value,
        "event_performance_number_identifier": 88,
    }

    transport = ASGITransport(app=ctx.app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )

    assert response.status_code == 404, response.json()
    assert response.json()["detail"] == "users not found"
    assert ctx.redis.store == {}


@pytest.mark.asyncio
async def test_set_worker_on_event_request_validation(integration_context):
    ctx = integration_context

    payload = {
        "worker_ids": "not-a-list",
        "shift": ShiftEnum.day.value,
        "event_performance_number_identifier": "bad-int",
    }

    transport = ASGITransport(app=ctx.app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )

    assert response.status_code == 422, response.json()
    assert ctx.redis.store == {}

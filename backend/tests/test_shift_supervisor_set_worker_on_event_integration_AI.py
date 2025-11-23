import pytest
import pytest_asyncio
from fastapi import FastAPI, status
from httpx import AsyncClient, ASGITransport
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from app.models.enums import ShiftEnum
from app.models.users import Role
from app.repository.worker_assignment import set_worker_on_event

# --- Фіктивні об'єкти для тестування ---
class FakeRedis:
    def __init__(self):
        self.store = {}
        self.expirations = {}
    async def set(self, key, value):
        self.store[key] = value
    async def expire(self, key, ttl):
        self.expirations[key] = ttl

class FakeUser:
    def __init__(self, id, role=Role.technician):
        self.id = id
        self.role = role

# --- Фікстури ---
@pytest_asyncio.fixture
async def test_app(monkeypatch):
    # Мокаємо залежності FastAPI
    app = FastAPI()
    redis = FakeRedis()
    users_db = {
        1: FakeUser(1, Role.technician),
        2: FakeUser(2, Role.technician),
        3: FakeUser(3, Role.engineer),
    }
    # Мокаємо get_users_by_ids
    async def fake_get_users_by_ids(ids, db):
        return [users_db[i] for i in ids if i in users_db]
    # Мокаємо Depends
    monkeypatch.setattr('app.api.roles.shift_supervisor.get_users_by_ids', fake_get_users_by_ids)
    monkeypatch.setattr('app.repository.worker_assignment.set_worker_on_event', AsyncMock())
    # Мокаємо Redis
    async def override_get_redis():
        yield redis
    # Мокаємо роль доступу
    async def override_role_access():
        return SimpleNamespace(id=100, role=Role.shift_supervisor)
    # Підключаємо роутер
    from app.api.roles.shift_supervisor import shift_supervisor_router, get_redis, shift_supervisor_only_access
    app.include_router(shift_supervisor_router, prefix="/api")
    app.dependency_overrides[get_redis] = override_get_redis
    app.dependency_overrides[shift_supervisor_only_access] = override_role_access
    yield app, redis, users_db

# --- Тести ---
@pytest.mark.asyncio
async def test_set_worker_on_event_success(test_app):
    """Успішний інтеграційний сценарій: всі техніки закріплені за подією."""
    app, redis, users_db = test_app
    payload = {
        "worker_ids": [1, 2],
        "shift": ShiftEnum.day.value,
        "event_performance_number_identifier": 42,
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )
    assert response.status_code == status.HTTP_201_CREATED
    # set_worker_on_event должен быть вызван с правильными аргументами
    set_worker_on_event.assert_awaited()

@pytest.mark.asyncio
async def test_set_worker_on_event_non_technician_error(test_app):
    """Помилка: серед worker_ids є не-технік (очікується 400)."""
    app, redis, users_db = test_app
    payload = {
        "worker_ids": [1, 3],  # 3 - engineer
        "shift": ShiftEnum.night.value,
        "event_performance_number_identifier": 99,
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_set_worker_on_event_user_not_found_error(test_app, monkeypatch):
    """Помилка: worker_ids містить неіснуючого користувача (очікується 404)."""
    app, redis, users_db = test_app
    # Мокаємо get_users_by_ids щоб повернути порожній список
    async def fake_get_users_by_ids(ids, db):
        return []
    monkeypatch.setattr('app.api.roles.shift_supervisor.get_users_by_ids', fake_get_users_by_ids)
    payload = {
        "worker_ids": [999],
        "shift": ShiftEnum.day.value,
        "event_performance_number_identifier": 77,
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_set_worker_on_event_validation_error(test_app):
    """Валідація: некоректний тип worker_ids (очікується 422)."""
    app, redis, users_db = test_app
    payload = {
        "worker_ids": "not-a-list",
        "shift": ShiftEnum.day.value,
        "event_performance_number_identifier": 1,
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/shift_supervisor/set_worker_on_event",
            params={
                "shift": payload["shift"],
                "event_performance_number_identifier": payload["event_performance_number_identifier"],
            },
            json=payload["worker_ids"],
        )
    assert response.status_code == 422

# Додатково можна розширити тестами на транзакції та DTO/Entity mapping, якщо є відповідна логіка.

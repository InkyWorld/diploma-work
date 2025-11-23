from app.repository.worker_assignment import set_worker_on_event
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch, call



# Моки для WorkEvent и Redis

class FakeWorkEvent:
    def __init__(self, identifier):
        self.event_performance_number_identifier = identifier
    def model_dump_json(self):
        return f'{{"event_performance_number_identifier": {self.event_performance_number_identifier}}}'

# Клас-мок для WorkEvent.find, який повертає об'єкт з async def all()
class AsyncAllMock:
    def __init__(self, result):
        self._result = result
    async def all(self):
        return self._result

@pytest.mark.asyncio
async def test_set_worker_on_event_assigns_all_workers():
    """Позитивний сценарій: всі користувачі отримують подію в Redis."""
    users = [SimpleNamespace(id=1), SimpleNamespace(id=2)]
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())
    fake_event = FakeWorkEvent(777)
    with patch('app.models.events.WorkEvent.find', return_value=AsyncAllMock([fake_event])):
        await set_worker_on_event(users, "day", 777, redis)
    expected_calls = [
        call("workers_set_event:1:day:777", fake_event.model_dump_json()),
        call("workers_set_event:2:day:777", fake_event.model_dump_json()),
    ]
    redis.set.assert_has_awaits(expected_calls, any_order=False)
    expire_calls = [
        call("workers_set_event:1:day:777", 43200),
        call("workers_set_event:2:day:777", 43200),
    ]
    redis.expire.assert_has_awaits(expire_calls, any_order=False)

@pytest.mark.asyncio
async def test_set_worker_on_event_event_not_found():
    """Негативний сценарій: подія не знайдена, очікується ValueError."""
    users = [SimpleNamespace(id=1)]
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())
    with patch('app.models.events.WorkEvent.find', return_value=AsyncAllMock([])):
        with pytest.raises(ValueError):
            await set_worker_on_event(users, "day", 123, redis)
    redis.set.assert_not_called()
    redis.expire.assert_not_called()

@pytest.mark.asyncio
async def test_set_worker_on_event_handles_empty_users():
    """Граничний випадок: порожній список користувачів, Redis не викликається."""
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())
    fake_event = FakeWorkEvent(888)
    with patch('app.models.events.WorkEvent.find', return_value=AsyncAllMock([fake_event])):
        await set_worker_on_event([], "night", 888, redis)
    redis.set.assert_not_called()
    redis.expire.assert_not_called()

@pytest.mark.asyncio
async def test_set_worker_on_event_user_without_id():
    """Негативний сценарій: користувач без id, очікується AttributeError."""
    users = [SimpleNamespace(full_name="NoId")]  # немає id
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())
    fake_event = FakeWorkEvent(999)
    with patch('app.models.events.WorkEvent.find', return_value=AsyncAllMock([fake_event])):
        with pytest.raises(AttributeError):
            await set_worker_on_event(users, "swing", 999, redis)
    redis.set.assert_not_called()
    redis.expire.assert_not_called()

@pytest.mark.asyncio
async def test_set_worker_on_event_multiple_calls():
    """Граничний випадок: декілька викликів з різними ідентифікаторами."""
    users = [SimpleNamespace(id=10)]
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())
    fake_event1 = FakeWorkEvent(1)
    fake_event2 = FakeWorkEvent(2)
    # Для side_effect — змінюємо return_value на різні об'єкти
    with patch('app.models.events.WorkEvent.find', side_effect=[AsyncAllMock([fake_event1]), AsyncAllMock([fake_event2])]):
        await set_worker_on_event(users, "day", 1, redis)
        await set_worker_on_event(users, "night", 2, redis)
    redis.set.assert_any_await("workers_set_event:10:day:1", fake_event1.model_dump_json())
    redis.set.assert_any_await("workers_set_event:10:night:2", fake_event2.model_dump_json())
    redis.expire.assert_any_await("workers_set_event:10:day:1", 43200)
    redis.expire.assert_any_await("workers_set_event:10:night:2", 43200)

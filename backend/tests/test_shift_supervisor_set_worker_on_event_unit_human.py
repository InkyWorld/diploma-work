import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, call

from app.repository.worker_assignment import set_worker_on_event


@pytest.mark.asyncio
async def test_set_worker_on_event_assigns_all_workers():
    users = [SimpleNamespace(id=1), SimpleNamespace(id=2)]
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())

    await set_worker_on_event(users, "day", 777, redis)

    expected_calls = [
        call("workers_set_event:1:day:777", 1),
        call("workers_set_event:2:day:777", 1),
    ]
    redis.set.assert_has_awaits(expected_calls, any_order=False)

    expire_calls = [
        call("workers_set_event:1:day:777", 43200),
        call("workers_set_event:2:day:777", 43200),
    ]
    redis.expire.assert_has_awaits(expire_calls, any_order=False)


@pytest.mark.asyncio
async def test_set_worker_on_event_raises_without_user_id():
    users = [SimpleNamespace(full_name="NoId Technician")]
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())

    with pytest.raises(AttributeError):
        await set_worker_on_event(users, "night", 5, redis)

    redis.set.assert_not_called()
    redis.expire.assert_not_called()


@pytest.mark.asyncio
async def test_set_worker_on_event_handles_empty_list():
    redis = SimpleNamespace(set=AsyncMock(), expire=AsyncMock())

    await set_worker_on_event([], "swing", 999, redis)

    redis.set.assert_not_called()
    redis.expire.assert_not_called()

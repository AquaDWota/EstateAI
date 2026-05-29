import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status


class InMemoryRateLimiter:
    def __init__(self) -> None:
        self._events: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str, max_requests: int, window_seconds: int) -> None:
        now = time.time()
        start = now - window_seconds
        events = self._events[key]
        while events and events[0] < start:
            events.popleft()
        if len(events) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please retry shortly.",
            )
        events.append(now)


rate_limiter = InMemoryRateLimiter()


def request_actor_key(request: Request) -> str:
    user_id = getattr(request.state, "user_id", None)
    if user_id:
        return f"user:{user_id}"
    client_host = request.client.host if request.client else "unknown"
    return f"ip:{client_host}"

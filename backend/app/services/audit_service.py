from __future__ import annotations

from datetime import UTC, datetime
from threading import Lock


class AuditService:
    def __init__(self) -> None:
        self._events: list[dict] = []
        self._lock = Lock()

    def record(self, *, user_id: str, action: str, metadata: dict | None = None) -> None:
        with self._lock:
            self._events.insert(
                0,
                {
                    "timestamp": datetime.now(UTC).isoformat(),
                    "userId": user_id,
                    "action": action,
                    "metadata": metadata or {},
                },
            )
            self._events = self._events[:500]

    def recent(self, limit: int = 100) -> list[dict]:
        with self._lock:
            return list(self._events[:limit])


audit_service = AuditService()

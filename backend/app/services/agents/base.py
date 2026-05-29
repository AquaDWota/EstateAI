from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any


class BaseAgent(ABC):
    name: str = "base"
    description: str = ""

    @abstractmethod
    async def run(self, params: dict[str, Any]) -> dict[str, Any]:
        pass

    def _result(self, data: dict[str, Any]) -> dict[str, Any]:
        return {
            "agent": self.name,
            "description": self.description,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data,
        }

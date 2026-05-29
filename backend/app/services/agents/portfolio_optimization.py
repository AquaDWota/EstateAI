from app.services.agents.base import BaseAgent
from app.services.data_store import PROPERTIES


class PortfolioOptimizationAgent(BaseAgent):
    name = "portfolio_optimization"
    description = "Suggests allocation strategies balancing risk vs return"

    async def run(self, params: dict) -> dict:
        risk_tolerance = params.get("riskTolerance", "moderate")
        top = sorted(
            PROPERTIES,
            key=lambda x: x["estimatedRoi"] / max(x["riskScore"], 1),
            reverse=True,
        )[:8]

        allocation = {
            "conservative": {"multifamily": 40, "condo": 30, "single_family": 30},
            "moderate": {"multifamily": 50, "townhouse": 25, "commercial": 25},
            "aggressive": {"multifamily": 35, "commercial": 35, "single_family": 30},
        }.get(risk_tolerance, {"multifamily": 45, "condo": 35, "single_family": 20})

        return self._result({
            "riskTolerance": risk_tolerance,
            "recommendedAllocation": allocation,
            "suggestedProperties": [
                {
                    "id": p["id"],
                    "address": p["address"],
                    "weight": round(100 / len(top), 1),
                    "roi": p["estimatedRoi"],
                    "risk": p["riskScore"],
                }
                for p in top
            ],
            "expectedPortfolioRoi": round(
                sum(p["estimatedRoi"] for p in top) / len(top), 2
            ),
            "strategy": (
                "Diversify across 3-5 high-growth submarkets; cap multifamily at 50% "
                "for moderate risk profiles."
            ),
        })

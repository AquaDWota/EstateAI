from app.services.agents.base import BaseAgent
from app.services.data_store import PROPERTIES


class OpportunityDetectionAgent(BaseAgent):
    name = "opportunity_detection"
    description = "Finds undervalued properties and high-growth areas"

    async def run(self, params: dict) -> dict:
        undervalued = [p for p in PROPERTIES if p["undervalued"]][:10]
        high_growth = sorted(
            PROPERTIES, key=lambda x: x["appreciationForecast"], reverse=True
        )[:5]
        high_flow = sorted(
            PROPERTIES, key=lambda x: x["monthlyCashFlow"], reverse=True
        )[:5]

        zones = [
            {"zone": "Downtown Core", "growthScore": 82, "properties": 18},
            {"zone": "Frog Hollow", "growthScore": 74, "properties": 14},
            {"zone": "South Green", "growthScore": 71, "properties": 12},
        ]

        return self._result({
            "undervaluedCount": len([p for p in PROPERTIES if p["undervalued"]]),
            "undervalued": [
                {
                    "id": p["id"],
                    "address": p["address"],
                    "price": p["price"],
                    "aiScore": p["aiScore"],
                    "estimatedRoi": p["estimatedRoi"],
                }
                for p in undervalued
            ],
            "highGrowthAreas": zones,
            "topAppreciation": [
                {"id": p["id"], "address": p["address"], "forecast": p["appreciationForecast"]}
                for p in high_growth
            ],
            "topCashFlow": [
                {"id": p["id"], "address": p["address"], "cashFlow": p["monthlyCashFlow"]}
                for p in high_flow
            ],
        })

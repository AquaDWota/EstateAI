from app.services.agents.base import BaseAgent
from app.services.property_repository import property_repository


class OpportunityDetectionAgent(BaseAgent):
    name = "opportunity_detection"
    description = "Finds undervalued properties and high-growth areas"

    async def run(self, params: dict) -> dict:
        properties = await property_repository.list_properties(limit=300, offset=0)
        undervalued = [p for p in properties if p["undervalued"]][:10]
        high_growth = sorted(
            properties, key=lambda x: x["appreciationForecast"], reverse=True
        )[:5]
        high_flow = sorted(
            properties, key=lambda x: x["price"] * 0.0032, reverse=True
        )[:5]

        zones = [
            {"zone": "Downtown Core", "growthScore": 82, "properties": 18},
            {"zone": "Frog Hollow", "growthScore": 74, "properties": 14},
            {"zone": "South Green", "growthScore": 71, "properties": 12},
        ]

        return self._result({
            "undervaluedCount": len([p for p in properties if p["undervalued"]]),
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
                {"id": p["id"], "address": p["address"], "cashFlow": round(p["price"] * 0.0032)}
                for p in high_flow
            ],
        })

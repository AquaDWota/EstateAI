from app.services.agents.base import BaseAgent
from app.services.property_repository import property_repository


class PropertyScoringAgent(BaseAgent):
    name = "property_scoring"
    description = "Scores properties on ROI, risk, rental demand, and appreciation"

    async def run(self, params: dict) -> dict:
        property_id = params.get("property_id")
        properties = await property_repository.list_properties(limit=300, offset=0)
        if not properties:
            return self._result({"error": "No properties available for scoring"})
        if property_id:
            prop = next((item for item in properties if item["id"] == property_id), None)
            if not prop:
                return self._result({"error": "Property not found"})
            return self._result(self._score_one(prop))

        scored = [self._score_one(p) for p in properties[:20]]
        return self._result({"topScored": scored})

    def _score_one(self, p: dict) -> dict:
        composite = (
            p["estimatedRoi"] * 0.3
            + p["rentalDemand"] * 0.25
            + p["aiScore"] * 0.25
            + (100 - p["riskScore"]) * 0.2
        ) / 100 * 100
        return {
            "propertyId": p["id"],
            "address": p["address"],
            "compositeScore": round(composite, 1),
            "roiScore": p["estimatedRoi"],
            "riskScore": p["riskScore"],
            "rentalDemandScore": p["rentalDemand"],
            "appreciationScore": p["appreciationForecast"],
            "recommendation": p["aiRecommendation"],
        }

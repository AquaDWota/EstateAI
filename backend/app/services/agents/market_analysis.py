from app.services.agents.base import BaseAgent
from app.services.data_store import PROPERTIES


class MarketAnalysisAgent(BaseAgent):
    name = "market_analysis"
    description = "Tracks trends, appreciation patterns, and economic indicators"

    async def run(self, params: dict) -> dict:
        zip_code = params.get("zipCode")
        city = params.get("city")
        subset = PROPERTIES
        if zip_code:
            subset = [p for p in PROPERTIES if p["zipCode"] == zip_code]
        elif city:
            subset = [p for p in PROPERTIES if p["city"].lower() == city.lower()]
        if not subset:
            subset = PROPERTIES

        avg_appreciation = sum(p["appreciationForecast"] for p in subset) / len(subset)
        avg_yield = sum(p["rentalYield"] for p in subset) / len(subset)
        avg_cap = sum(p["capRate"] for p in subset) / len(subset)
        sentiment = min(100, round(55 + avg_appreciation * 3 + avg_yield * 2))

        return self._result({
            "zipCode": zip_code or "mixed",
            "city": city or "multi-market",
            "marketSentimentIndex": sentiment,
            "avgAppreciationForecast": round(avg_appreciation, 2),
            "avgRentalYield": round(avg_yield, 2),
            "avgCapRate": round(avg_cap, 2),
            "economicIndicators": {
                "employmentTrend": "stable",
                "interestRateOutlook": "elevated",
                "inventoryMonths": 3.2,
                "rentGrowthYoY": 4.8,
            },
            "trends": [
                {"metric": "Median price", "direction": "up", "change": 3.2},
                {"metric": "Days on market", "direction": "down", "change": -8.5},
                {"metric": "Rental demand", "direction": "up", "change": 6.1},
            ],
            "insight": (
                f"Selected market shows positive momentum with {sentiment}/100 sentiment. "
                "Multifamily and transit-adjacent assets lead appreciation."
            ),
        })

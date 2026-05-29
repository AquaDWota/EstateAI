from app.services.agents.base import BaseAgent
from app.services.data_store import PROPERTIES


class InvestorReportAgent(BaseAgent):
    name = "investor_report"
    description = "Generates investor-ready reports and summaries"

    async def run(self, params: dict) -> dict:
        prop = params.get("property")
        if prop:
            return self._result({
                "title": f"Investment Report: {prop['address']}",
                "executiveSummary": prop["investmentThesis"],
                "recommendation": prop["aiRecommendation"],
                "confidence": prop["confidence"],
                "metrics": {
                    "price": prop["price"],
                    "roi": prop["estimatedRoi"],
                    "capRate": prop["capRate"],
                    "rentalYield": prop["rentalYield"],
                    "monthlyCashFlow": prop["monthlyCashFlow"],
                },
                "risk": prop["riskExplanation"],
                "exitStrategy": prop["exitStrategy"],
                "sections": [
                    "Market positioning",
                    "Financial projections",
                    "Risk matrix",
                    "Comparable analysis",
                ],
            })

        market_avg_roi = sum(p["estimatedRoi"] for p in PROPERTIES) / len(PROPERTIES)
        return self._result({
            "title": "Multi-Market Investment Report",
            "executiveSummary": (
                f"Portfolio scan of {len(PROPERTIES)} assets shows average ROI "
                f"{market_avg_roi:.1f}% with selective undervaluation in multifamily."
            ),
            "highlights": [
                f"{len([p for p in PROPERTIES if p['undervalued']])} undervalued properties flagged",
                "Rental demand index above regional median",
                "Cap rate compression expected in downtown submarket",
            ],
            "generatedFor": "demo",
        })

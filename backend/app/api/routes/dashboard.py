from fastapi import APIRouter, HTTPException, status

from app.core.auth import AuthenticatedUser, CurrentUser
from app.services.property_repository import property_repository

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
async def get_dashboard(_: AuthenticatedUser = CurrentUser):
    try:
        properties = await property_repository.list_properties(limit=200, offset=0)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Dashboard data source is unavailable.",
        ) from exc

    undervalued = [p for p in properties if p["undervalued"]]
    top_opps = sorted(properties, key=lambda x: x["aiScore"], reverse=True)[:6]
    total_value = 2_840_000
    monthly_cash_flow = round(sum(p["price"] * 0.0032 for p in properties[:5]))
    sentiment = min(
        100,
        round(
            55
            + sum(p["appreciationForecast"] for p in properties[:20]) / 20 * 2
        ),
    )

    appreciation_chart = [
        {"month": "Jan", "value": 2.1},
        {"month": "Feb", "value": 2.4},
        {"month": "Mar", "value": 2.8},
        {"month": "Apr", "value": 3.0},
        {"month": "May", "value": 3.2},
        {"month": "Jun", "value": 3.5},
        {"month": "Jul", "value": 3.4},
        {"month": "Aug", "value": 3.8},
        {"month": "Sep", "value": 4.0},
        {"month": "Oct", "value": 4.2},
        {"month": "Nov", "value": 4.1},
        {"month": "Dec", "value": 4.5},
    ]

    rental_demand_chart = [
        {"month": "Jan", "demand": 68},
        {"month": "Feb", "demand": 70},
        {"month": "Mar", "demand": 72},
        {"month": "Apr", "demand": 74},
        {"month": "May", "demand": 76},
        {"month": "Jun", "demand": 78},
        {"month": "Jul", "demand": 80},
        {"month": "Aug", "demand": 79},
        {"month": "Sep", "demand": 82},
        {"month": "Oct", "demand": 84},
        {"month": "Nov", "demand": 85},
        {"month": "Dec", "demand": 87},
    ]

    heatmap = [
        {
            "lat": p["latitude"],
            "lng": p["longitude"],
            "intensity": p["aiScore"] / 100,
            "price": p["price"],
            "id": p["id"],
        }
        for p in properties[:40]
    ]

    return {
        "portfolio": {
            "totalValue": total_value,
            "monthlyCashFlow": monthly_cash_flow,
            "roi": 14.2,
            "rentalYield": 7.8,
            "propertyCount": 5,
        },
        "marketSentimentIndex": sentiment,
        "aiOpportunityFeed": [
            {
                "id": p["id"],
                "title": f"{'Undervalued' if p['undervalued'] else 'Strong'} — {p['address']}",
                "message": p["investmentThesis"],
                "aiScore": p["aiScore"],
                "type": "opportunity" if p["undervalued"] else "insight",
            }
            for p in top_opps[:5]
        ],
        "topOpportunities": top_opps,
        "undervaluedCount": len(undervalued),
        "charts": {
            "appreciation": appreciation_chart,
            "rentalDemand": rental_demand_chart,
        },
        "heatmap": heatmap,
        "economicIndicators": {
            "mortgageRate": 6.85,
            "inflation": 2.9,
            "unemployment": 4.2,
            "rentGrowth": 4.8,
        },
        "aiConfidenceScore": 84,
        "riskScore": 38,
    }

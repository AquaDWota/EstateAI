from fastapi import APIRouter, HTTPException, Query, status

from app.core.auth import AuthenticatedUser, CurrentUser
from app.services.property_repository import property_repository

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("")
async def list_properties(
    _: AuthenticatedUser = CurrentUser,
    min_price: float | None = None,
    max_price: float | None = None,
    min_roi: float | None = None,
    max_risk: float | None = None,
    property_type: str | None = None,
    undervalued_only: bool = False,
    q: str | None = Query(None, description="Semantic/natural language search"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0, le=5000),
):
    try:
        items = await property_repository.list_properties(limit=1000, offset=0)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Property database is unavailable.",
        ) from exc

    if min_price is not None:
        items = [item for item in items if item["price"] >= min_price]
    if max_price is not None:
        items = [item for item in items if item["price"] <= max_price]
    if min_roi is not None:
        items = [item for item in items if item["estimatedRoi"] >= min_roi]
    if max_risk is not None:
        items = [item for item in items if item["riskScore"] <= max_risk]
    if property_type:
        items = [item for item in items if item["propertyType"] == property_type]
    if undervalued_only:
        items = [item for item in items if item["undervalued"]]
    if q:
        q_lower = q.lower()
        items = [
            item
            for item in items
            if q_lower in f"{item['address']} {item['city']} {item['state']} {item['zipCode']}".lower()
        ]

    return {
        "total": len(items),
        "offset": offset,
        "limit": limit,
        "items": items[offset : offset + limit],
    }


@router.get("/{property_id}")
async def get_property_detail(property_id: str, _: AuthenticatedUser = CurrentUser):
    try:
        prop = await property_repository.get_property(property_id)
        comparables_pool = await property_repository.list_properties(limit=250, offset=0)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Property database is unavailable.",
        ) from exc

    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    comparables = [
        p
        for p in comparables_pool
        if p["id"] != property_id and p["propertyType"] == prop["propertyType"]
    ][:4]
    return {"property": prop, "comparables": comparables}


@router.get("/{property_id}/analysis")
async def get_property_analysis(property_id: str, _: AuthenticatedUser = CurrentUser):
    try:
        prop = await property_repository.get_property(property_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Property database is unavailable.",
        ) from exc
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return {
        "recommendation": prop["aiRecommendation"],
        "confidence": prop["confidence"],
        "riskExplanation": prop["riskExplanation"],
        "investmentThesis": prop["investmentThesis"],
        "exitStrategy": prop["exitStrategy"],
        "summary": prop["investmentThesis"],
    }

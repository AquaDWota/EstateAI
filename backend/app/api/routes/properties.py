from fastapi import APIRouter, HTTPException, Query

from app.services.data_store import PROPERTIES, filter_properties, get_property

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("")
async def list_properties(
    min_price: float | None = None,
    max_price: float | None = None,
    min_roi: float | None = None,
    max_risk: float | None = None,
    property_type: str | None = None,
    undervalued_only: bool = False,
    q: str | None = Query(None, description="Semantic/natural language search"),
    limit: int = 50,
    offset: int = 0,
):
    items = filter_properties(
        min_price=min_price,
        max_price=max_price,
        min_roi=min_roi,
        max_risk=max_risk,
        property_type=property_type,
        undervalued_only=undervalued_only,
        query=q,
    )
    return {
        "total": len(items),
        "offset": offset,
        "limit": limit,
        "items": items[offset : offset + limit],
    }


@router.get("/{property_id}")
async def get_property_detail(property_id: str):
    prop = get_property(property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    comparables = [
        p
        for p in PROPERTIES
        if p["id"] != property_id and p["propertyType"] == prop["propertyType"]
    ][:4]
    return {"property": prop, "comparables": comparables}


@router.get("/{property_id}/analysis")
async def get_property_analysis(property_id: str):
    prop = get_property(property_id)
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

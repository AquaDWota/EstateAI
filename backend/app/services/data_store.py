"""In-memory property store mirroring frontend seed data for demo API."""

import math

STREETS = [
    "Main St", "Trumbull St", "Albany Ave", "Farmington Ave", "Broad St",
    "Capitol Ave", "Park St", "Wethersfield Ave", "Maple Ave", "Asylum St",
]
TYPES = ["SINGLE_FAMILY", "MULTIFAMILY", "CONDO", "TOWNHOUSE", "COMMERCIAL"]
MARKETS = [
    {"city": "Austin", "state": "TX", "zipCode": "78701", "latitude": 30.2672, "longitude": -97.7431},
    {"city": "Denver", "state": "CO", "zipCode": "80202", "latitude": 39.7528, "longitude": -104.9990},
    {"city": "Phoenix", "state": "AZ", "zipCode": "85004", "latitude": 33.4516, "longitude": -112.0740},
    {"city": "Miami", "state": "FL", "zipCode": "33131", "latitude": 25.7617, "longitude": -80.1918},
    {"city": "Nashville", "state": "TN", "zipCode": "37203", "latitude": 36.1551, "longitude": -86.7852},
    {"city": "Charlotte", "state": "NC", "zipCode": "28202", "latitude": 35.2271, "longitude": -80.8431},
    {"city": "Seattle", "state": "WA", "zipCode": "98104", "latitude": 47.6025, "longitude": -122.3310},
    {"city": "Atlanta", "state": "GA", "zipCode": "30303", "latitude": 33.7490, "longitude": -84.3880},
]
IMAGES = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
]


def _sr(seed: float) -> float:
    return math.sin(seed) * 10000 - math.floor(math.sin(seed) * 10000)


def generate_properties(count: int = 75) -> list[dict]:
    props = []
    for i in range(count):
        seed = i + 1
        r = lambda n: _sr(seed * n)
        market = MARKETS[int(r(100) * len(MARKETS)) % len(MARKETS)]
        ptype = TYPES[int(r(1) * len(TYPES)) % len(TYPES)]
        beds = 4 + int(r(2) * 8) if ptype == "MULTIFAMILY" else 1 + int(r(3) * 4)
        baths = max(1.0, beds - int(r(4) * 2))
        sqft = 800 + int(r(5) * 3200)
        price = round((180000 + r(6) * 520000) / 1000) * 1000
        rental_yield = 4 + r(7) * 8
        cap_rate = 3.5 + r(8) * 6
        roi = 6 + r(9) * 14
        appreciation = 2 + r(10) * 9
        ai_score = 55 + r(11) * 45
        risk = 15 + r(12) * 70
        rental_demand = 50 + r(13) * 50
        undervalued = ai_score > 78 and roi > 12 and risk < 45
        monthly_rent = round((price * (rental_yield / 100)) / 12)
        cash_flow = round(monthly_rent * 0.62 - price * 0.004)
        rec = "BUY" if ai_score > 80 and risk < 40 else ("AVOID" if risk > 65 else "HOLD")
        street_num = 10 + int(r(14) * 990)
        street = STREETS[int(r(15) * len(STREETS)) % len(STREETS)]
        img = IMAGES[int(r(16) * len(IMAGES)) % len(IMAGES)]
        historical = [
            {"year": y, "price": round(price * (0.72 + idx * 0.045 + r(17 + idx) * 0.03))}
            for idx, y in enumerate([2019, 2020, 2021, 2022, 2023, 2024, 2025])
        ]
        props.append({
            "id": f"prop-{str(i + 1).zfill(3)}",
            "address": f"{street_num} {street}",
            "city": market["city"],
            "state": market["state"],
            "zipCode": market["zipCode"],
            "latitude": market["latitude"] + (r(18) - 0.5) * 0.08,
            "longitude": market["longitude"] + (r(19) - 0.5) * 0.09,
            "price": price,
            "beds": beds,
            "baths": baths,
            "sqft": sqft,
            "propertyType": ptype,
            "imageUrl": img,
            "images": [img, IMAGES[(i + 1) % len(IMAGES)], IMAGES[(i + 2) % len(IMAGES)]],
            "estimatedRoi": round(roi, 1),
            "capRate": round(cap_rate, 1),
            "rentalYield": round(rental_yield, 1),
            "appreciationForecast": round(appreciation, 1),
            "aiScore": round(ai_score),
            "riskScore": round(risk),
            "undervalued": undervalued,
            "rentalDemand": round(rental_demand),
            "yearBuilt": 1920 + int(r(20) * 100),
            "description": f"{ptype.replace('_', ' ').lower()} in {market['city']}.",
            "crimeIndex": round(20 + r(21) * 50),
            "transitScore": round(40 + r(22) * 55),
            "schoolRating": round(5 + r(23) * 4),
            "monthlyRent": monthly_rent,
            "monthlyCashFlow": cash_flow,
            "historicalPrices": historical,
            "demographics": {
                "medianIncome": round(42000 + r(24) * 38000),
                "populationGrowth": round((r(25) - 0.3) * 30, 1) / 10,
                "employmentRate": round(88 + r(26) * 10, 1),
            },
            "aiRecommendation": rec,
            "confidence": round(65 + r(27) * 30),
            "investmentThesis": f"Yield {rental_yield:.1f}% with {appreciation:.1f}% appreciation outlook.",
            "riskExplanation": "Stable market fundamentals with measured vacancy risk.",
            "exitStrategy": "5-7 year hold; evaluate 1031 exchange on cap compression.",
        })
    return sorted(props, key=lambda x: x["aiScore"], reverse=True)


PROPERTIES: list[dict] = generate_properties(75)


def get_property(property_id: str) -> dict | None:
    return next((p for p in PROPERTIES if p["id"] == property_id), None)


def filter_properties(
    min_price: float | None = None,
    max_price: float | None = None,
    min_roi: float | None = None,
    max_risk: float | None = None,
    property_type: str | None = None,
    undervalued_only: bool = False,
    query: str | None = None,
) -> list[dict]:
    result = list(PROPERTIES)
    q = (query or "").lower()
    if q:
        if "undervalued" in q:
            result = [p for p in result if p["undervalued"]]
        if "multifamily" in q:
            result = [p for p in result if p["propertyType"] == "MULTIFAMILY"]
        if "low risk" in q or "low-risk" in q:
            result = [p for p in result if p["riskScore"] < 40]
        if "rental demand" in q or "high rental" in q:
            result = [p for p in result if p["rentalDemand"] > 75]
        if "cash flow" in q:
            result = sorted(result, key=lambda x: x["monthlyCashFlow"], reverse=True)
        for market in MARKETS:
            if market["city"].lower() in q or market["zipCode"] in q:
                result = [
                    p for p in result
                    if p["city"] == market["city"] or p["zipCode"] == market["zipCode"]
                ]
                break
    if min_price:
        result = [p for p in result if p["price"] >= min_price]
    if max_price:
        result = [p for p in result if p["price"] <= max_price]
    if min_roi:
        result = [p for p in result if p["estimatedRoi"] >= min_roi]
    if max_risk:
        result = [p for p in result if p["riskScore"] <= max_risk]
    if property_type:
        result = [p for p in result if p["propertyType"] == property_type]
    if undervalued_only:
        result = [p for p in result if p["undervalued"]]
    return result

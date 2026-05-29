from __future__ import annotations

import asyncpg

from app.core.config import settings


def _to_property(row: asyncpg.Record) -> dict:
    return {
        "id": row["id"],
        "address": row["address"],
        "city": row["city"],
        "state": row["state"],
        "zipCode": row["zipCode"],
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "price": row["price"],
        "beds": row["beds"],
        "baths": row["baths"],
        "sqft": row["sqft"],
        "propertyType": row["propertyType"],
        "imageUrl": row["imageUrl"],
        "images": row["images"] or [],
        "estimatedRoi": row["estimatedRoi"],
        "capRate": row["capRate"],
        "rentalYield": row["rentalYield"],
        "appreciationForecast": row["appreciationForecast"],
        "aiScore": row["aiScore"],
        "riskScore": row["riskScore"],
        "undervalued": row["undervalued"],
        "rentalDemand": row["rentalDemand"],
        "yearBuilt": row["yearBuilt"],
        "description": row["description"],
        "aiRecommendation": "BUY" if row["aiScore"] >= 80 else ("AVOID" if row["riskScore"] >= 65 else "HOLD"),
        "confidence": 80,
        "investmentThesis": row["description"] or "Data-backed investment thesis pending enrichment.",
        "riskExplanation": "Data-backed risk profile available in upcoming release.",
        "exitStrategy": "Hold 5-7 years and reassess based on cap-rate movement.",
        "crimeIndex": 30,
        "transitScore": 70,
        "schoolRating": 7,
        "monthlyRent": 0,
        "monthlyCashFlow": 0,
        "historicalPrices": [],
        "demographics": {
            "medianIncome": 0,
            "populationGrowth": 0,
            "employmentRate": 0,
        },
    }


class PropertyRepository:
    async def _connect(self) -> asyncpg.Connection:
        return await asyncpg.connect(settings.asyncpg_dsn, timeout=4)

    async def list_properties(self, limit: int, offset: int) -> list[dict]:
        conn = await self._connect()
        try:
            rows = await conn.fetch(
                """
                SELECT
                  id, address, city, state, "zipCode", latitude, longitude,
                  price, beds, baths, sqft, "propertyType", "imageUrl", images,
                  "estimatedRoi", "capRate", "rentalYield", "appreciationForecast",
                  "aiScore", "riskScore", undervalued, "rentalDemand", "yearBuilt", description
                FROM "Property"
                ORDER BY "aiScore" DESC
                OFFSET $1 LIMIT $2
                """,
                offset,
                limit,
            )
            return [_to_property(row) for row in rows]
        finally:
            await conn.close()

    async def count_properties(self) -> int:
        conn = await self._connect()
        try:
            value = await conn.fetchval('SELECT COUNT(*) FROM "Property"')
            return int(value or 0)
        finally:
            await conn.close()

    async def get_property(self, property_id: str) -> dict | None:
        conn = await self._connect()
        try:
            row = await conn.fetchrow(
                """
                SELECT
                  id, address, city, state, "zipCode", latitude, longitude,
                  price, beds, baths, sqft, "propertyType", "imageUrl", images,
                  "estimatedRoi", "capRate", "rentalYield", "appreciationForecast",
                  "aiScore", "riskScore", undervalued, "rentalDemand", "yearBuilt", description
                FROM "Property"
                WHERE id = $1
                """,
                property_id,
            )
            return _to_property(row) if row else None
        finally:
            await conn.close()


property_repository = PropertyRepository()

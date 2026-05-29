export type PropertyType =
  | "SINGLE_FAMILY"
  | "MULTIFAMILY"
  | "CONDO"
  | "TOWNHOUSE"
  | "COMMERCIAL";

export interface PropertyData {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: PropertyType;
  imageUrl: string;
  images: string[];
  estimatedRoi: number;
  capRate: number;
  rentalYield: number;
  appreciationForecast: number;
  aiScore: number;
  riskScore: number;
  undervalued: boolean;
  rentalDemand: number;
  yearBuilt: number;
  description: string;
  crimeIndex: number;
  transitScore: number;
  schoolRating: number;
  monthlyRent: number;
  monthlyCashFlow: number;
  historicalPrices: { year: number; price: number }[];
  demographics: {
    medianIncome: number;
    populationGrowth: number;
    employmentRate: number;
  };
  aiRecommendation: "BUY" | "HOLD" | "AVOID";
  confidence: number;
  investmentThesis: string;
  riskExplanation: string;
  exitStrategy: string;
}

const STREETS = [
  "Main St",
  "Trumbull St",
  "Albany Ave",
  "Farmington Ave",
  "Broad St",
  "Capitol Ave",
  "Park St",
  "Wethersfield Ave",
  "Maple Ave",
  "Asylum St",
  "Pleasant St",
  "Franklin Ave",
  "Homestead Ave",
  "Barbour St",
  "Tower Ave",
];

const MARKETS = [
  { city: "Austin", state: "TX", zipCode: "78701", latitude: 30.2672, longitude: -97.7431 },
  { city: "Denver", state: "CO", zipCode: "80202", latitude: 39.7528, longitude: -104.999 },
  { city: "Phoenix", state: "AZ", zipCode: "85004", latitude: 33.4516, longitude: -112.074 },
  { city: "Miami", state: "FL", zipCode: "33131", latitude: 25.7617, longitude: -80.1918 },
  { city: "Nashville", state: "TN", zipCode: "37203", latitude: 36.1551, longitude: -86.7852 },
  { city: "Charlotte", state: "NC", zipCode: "28202", latitude: 35.2271, longitude: -80.8431 },
  { city: "Seattle", state: "WA", zipCode: "98104", latitude: 47.6025, longitude: -122.331 },
  { city: "Atlanta", state: "GA", zipCode: "30303", latitude: 33.749, longitude: -84.388 },
];

const TYPES: PropertyType[] = [
  "SINGLE_FAMILY",
  "MULTIFAMILY",
  "CONDO",
  "TOWNHOUSE",
  "COMMERCIAL",
];

const IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d4cd42?w=800&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

export function generateProperties(count = 75): PropertyData[] {
  const properties: PropertyData[] = [];

  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    const r = (n: number) => seededRandom(seed * n);
    const market = pick(MARKETS, seed + 100);
    const propertyType = pick(TYPES, seed);
    const beds =
      propertyType === "MULTIFAMILY"
        ? 4 + Math.floor(r(2) * 8)
        : 1 + Math.floor(r(3) * 4);
    const baths = Math.max(1, beds - Math.floor(r(4) * 2));
    const sqft = 800 + Math.floor(r(5) * 3200);
    const price = Math.round((180000 + r(6) * 520000) / 1000) * 1000;
    const rentalYield = 4 + r(7) * 8;
    const capRate = 3.5 + r(8) * 6;
    const estimatedRoi = 6 + r(9) * 14;
    const appreciationForecast = 2 + r(10) * 9;
    const aiScore = 55 + r(11) * 45;
    const riskScore = 15 + r(12) * 70;
    const rentalDemand = 50 + r(13) * 50;
    const undervalued = aiScore > 78 && estimatedRoi > 12 && riskScore < 45;
    const monthlyRent = Math.round((price * (rentalYield / 100)) / 12);
    const monthlyCashFlow = Math.round(monthlyRent * 0.62 - price * 0.004);

    const rec =
      aiScore > 80 && riskScore < 40
        ? "BUY"
        : riskScore > 65
          ? "AVOID"
          : "HOLD";

    const streetNum = 10 + Math.floor(r(14) * 990);
    const street = pick(STREETS, seed + 2);
    const imageUrl = pick(IMAGES, seed + 3);

    const historicalPrices = [2019, 2020, 2021, 2022, 2023, 2024, 2025].map(
      (year, idx) => ({
        year,
        price: Math.round(price * (0.72 + idx * 0.045 + r(15 + idx) * 0.03)),
      })
    );

    properties.push({
      id: `prop-${String(i + 1).padStart(3, "0")}`,
      address: `${streetNum} ${street}`,
      city: market.city,
      state: market.state,
      zipCode: market.zipCode,
      latitude: market.latitude + (r(16) - 0.5) * 0.08,
      longitude: market.longitude + (r(17) - 0.5) * 0.09,
      price,
      beds,
      baths,
      sqft,
      propertyType,
      imageUrl,
      images: [imageUrl, pick(IMAGES, seed + 4), pick(IMAGES, seed + 5)],
      estimatedRoi: Math.round(estimatedRoi * 10) / 10,
      capRate: Math.round(capRate * 10) / 10,
      rentalYield: Math.round(rentalYield * 10) / 10,
      appreciationForecast: Math.round(appreciationForecast * 10) / 10,
      aiScore: Math.round(aiScore),
      riskScore: Math.round(riskScore),
      undervalued,
      rentalDemand: Math.round(rentalDemand),
      yearBuilt: 1920 + Math.floor(r(18) * 100),
      description: `${propertyType.replace("_", " ").toLowerCase()} investment opportunity in ${market.city} with strong rental fundamentals and transit access.`,
      crimeIndex: Math.round(20 + r(19) * 50),
      transitScore: Math.round(40 + r(20) * 55),
      schoolRating: Math.round(5 + r(21) * 4),
      monthlyRent,
      monthlyCashFlow,
      historicalPrices,
      demographics: {
        medianIncome: Math.round(42000 + r(22) * 38000),
        populationGrowth: Math.round((r(23) - 0.3) * 30) / 10,
        employmentRate: Math.round((88 + r(24) * 10) * 10) / 10,
      },
      aiRecommendation: rec,
      confidence: Math.round(65 + r(25) * 30),
      investmentThesis: `Strong ${rentalYield.toFixed(1)}% yield with ${appreciationForecast.toFixed(1)}% projected appreciation in ${market.city}.`,
      riskExplanation:
        riskScore < 40
          ? "Low volatility market with stable occupancy and diversified tenant demand."
          : "Moderate exposure to interest rate sensitivity and localized vacancy risk.",
      exitStrategy:
        rec === "BUY"
          ? "Target 5-7 year hold with value-add renovations before institutional exit."
          : "Monitor cap rate compression; consider 1031 exchange if yields decline.",
    });
  }

  return properties.sort((a, b) => b.aiScore - a.aiScore);
}

export const MOCK_PROPERTIES = generateProperties(75);

export function filterProperties(
  properties: PropertyData[],
  filters: {
    minPrice?: number;
    maxPrice?: number;
    minRoi?: number;
    maxRoi?: number;
    maxRisk?: number;
    propertyType?: PropertyType;
    undervaluedOnly?: boolean;
    query?: string;
  }
): PropertyData[] {
  let result = [...properties];
  const q = filters.query?.toLowerCase() ?? "";

  if (q) {
    if (q.includes("undervalued") || q.includes("multifamily")) {
      if (q.includes("undervalued")) result = result.filter((p) => p.undervalued);
      if (q.includes("multifamily"))
        result = result.filter((p) => p.propertyType === "MULTIFAMILY");
    }
    if (q.includes("low risk") || q.includes("low-risk")) {
      result = result.filter((p) => p.riskScore < 40);
    }
    if (q.includes("high rental") || q.includes("rental demand")) {
      result = result.filter((p) => p.rentalDemand > 75);
    }
    if (q.includes("cash flow") || q.includes("best cash flow")) {
      result = result.sort((a, b) => b.monthlyCashFlow - a.monthlyCashFlow);
    }
    const marketTerm = MARKETS.find(
      (m) =>
        q.includes(m.city.toLowerCase()) ||
        q.includes(m.state.toLowerCase()) ||
        q.includes(m.zipCode.toLowerCase())
    );
    if (marketTerm) {
      result = result.filter(
        (p) =>
          p.city === marketTerm.city ||
          p.state === marketTerm.state ||
          p.zipCode === marketTerm.zipCode
      );
    }
  }

  if (filters.minPrice) result = result.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice) result = result.filter((p) => p.price <= filters.maxPrice!);
  if (filters.minRoi) result = result.filter((p) => p.estimatedRoi >= filters.minRoi!);
  if (filters.maxRoi) result = result.filter((p) => p.estimatedRoi <= filters.maxRoi!);
  if (filters.maxRisk) result = result.filter((p) => p.riskScore <= filters.maxRisk!);
  if (filters.propertyType)
    result = result.filter((p) => p.propertyType === filters.propertyType);
  if (filters.undervaluedOnly) result = result.filter((p) => p.undervalued);

  return result;
}

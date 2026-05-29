import {
  MOCK_PROPERTIES,
  filterProperties,
  type PropertyData,
} from "./property-generator";

export function getLocalProperties(filters?: {
  minPrice?: number;
  maxPrice?: number;
  minRoi?: number;
  maxRisk?: number;
  propertyType?: string;
  undervaluedOnly?: boolean;
  q?: string;
}): PropertyData[] {
  return filterProperties(MOCK_PROPERTIES, {
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    minRoi: filters?.minRoi,
    maxRisk: filters?.maxRisk,
    propertyType: filters?.propertyType as PropertyData["propertyType"],
    undervaluedOnly: filters?.undervaluedOnly,
    query: filters?.q,
  });
}

export function getLocalProperty(id: string): PropertyData | undefined {
  return MOCK_PROPERTIES.find((p) => p.id === id);
}

export function getLocalDashboard() {
  const undervalued = MOCK_PROPERTIES.filter((p) => p.undervalued);
  const topOpps = [...MOCK_PROPERTIES]
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 6);

  return {
    portfolio: {
      totalValue: 2840000,
      monthlyCashFlow: 12450,
      roi: 14.2,
      rentalYield: 7.8,
      propertyCount: 5,
    },
    marketSentimentIndex: 78,
    aiOpportunityFeed: topOpps.slice(0, 5).map((p) => ({
      id: p.id,
      title: `${p.undervalued ? "Undervalued" : "Strong"} — ${p.address}`,
      message: p.investmentThesis,
      aiScore: p.aiScore,
      type: p.undervalued ? "opportunity" : "insight",
    })),
    topOpportunities: topOpps,
    undervaluedCount: undervalued.length,
    charts: {
      appreciation: [
        { month: "Jan", value: 2.1 },
        { month: "Feb", value: 2.4 },
        { month: "Mar", value: 2.8 },
        { month: "Apr", value: 3.0 },
        { month: "May", value: 3.2 },
        { month: "Jun", value: 3.5 },
        { month: "Jul", value: 3.4 },
        { month: "Aug", value: 3.8 },
        { month: "Sep", value: 4.0 },
        { month: "Oct", value: 4.2 },
        { month: "Nov", value: 4.1 },
        { month: "Dec", value: 4.5 },
      ],
      rentalDemand: [
        { month: "Jan", demand: 68 },
        { month: "Feb", demand: 70 },
        { month: "Mar", demand: 72 },
        { month: "Apr", demand: 74 },
        { month: "May", demand: 76 },
        { month: "Jun", demand: 78 },
        { month: "Jul", demand: 80 },
        { month: "Aug", demand: 79 },
        { month: "Sep", demand: 82 },
        { month: "Oct", demand: 84 },
        { month: "Nov", demand: 85 },
        { month: "Dec", demand: 87 },
      ],
    },
    heatmap: MOCK_PROPERTIES.slice(0, 40).map((p) => ({
      lat: p.latitude,
      lng: p.longitude,
      intensity: p.aiScore / 100,
      price: p.price,
      id: p.id,
    })),
    economicIndicators: {
      mortgageRate: 6.85,
      inflation: 2.9,
      unemployment: 4.2,
      rentGrowth: 4.8,
    },
    aiConfidenceScore: 84,
    riskScore: 38,
  };
}

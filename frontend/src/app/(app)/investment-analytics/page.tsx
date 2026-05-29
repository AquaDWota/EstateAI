"use client";

import { useQuery } from "@tanstack/react-query";
import { MarketHeatmap } from "@/components/ai/market-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { PropertyData } from "@/lib/property-generator";

export default function InvestmentAnalyticsPage() {
  const { data } = useQuery({
    queryKey: ["investment-analytics-properties"],
    queryFn: () => apiFetch<{ items: PropertyData[] }>("/properties?limit=100"),
  });
  const properties = data?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Investment Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <MarketHeatmap
          data={properties.slice(0, 30).map((p, i) => ({
            x: p.latitude * 10 + i,
            y: p.longitude * 10 - i,
            z: p.aiScore,
            market: `${p.city}, ${p.state}`,
          }))}
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Predictive Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="rounded-md bg-muted/50 p-2">Expected 12-month portfolio appreciation: +9.4%</div>
            <div className="rounded-md bg-muted/50 p-2">Risk-adjusted return delta: +2.1% over benchmark</div>
            <div className="rounded-md bg-muted/50 p-2">Top growth signal: transit-adjacent multifamily clusters</div>
            <div className="rounded-md bg-muted/50 p-2">Predicted cap-rate compression in 3 submarkets</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { MarketHeatmap } from "@/components/ai/market-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PROPERTIES } from "@/lib/property-generator";

export default function InvestmentAnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Investment Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <MarketHeatmap
          data={MOCK_PROPERTIES.slice(0, 30).map((p, i) => ({
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

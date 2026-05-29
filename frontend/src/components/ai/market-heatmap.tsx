"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";

export function MarketHeatmap({
  data,
}: {
  data: { x: number; y: number; z: number; market: string }[];
}) {
  return (
    <Card className="bg-card/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">AI Market Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="x" hide />
            <YAxis dataKey="y" hide />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(_, __, item) => [item.payload.market, `AI ${item.payload.z}`]}
            />
            <Scatter data={data} fill="#4F6B5B" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

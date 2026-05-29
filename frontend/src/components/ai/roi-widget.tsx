"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ROIWidget({
  roi,
  monthlyCashFlow,
}: {
  roi: number;
  monthlyCashFlow: number;
}) {
  return (
    <Card className="border-border/80 bg-card/80 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Projected ROI
          </p>
          <TrendingUp className="h-4 w-4 text-accent" />
        </div>
        <p className="mt-1 text-2xl font-semibold text-foreground">{roi.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">
          Est. monthly cash flow ${monthlyCashFlow.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}

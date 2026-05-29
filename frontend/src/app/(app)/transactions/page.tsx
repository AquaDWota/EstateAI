"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOSStore, type DealStage } from "@/store/use-os-store";

export default function TransactionsPage() {
  const deals = useOSStore((s) => s.deals);
  const setDealStage = useOSStore((s) => s.setDealStage);
  const stageSummary = useMemo(
    () =>
      deals.reduce<Record<string, number>>((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1;
        return acc;
      }, {}),
    [deals]
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transaction Management</h1>
      <div className="grid gap-2 sm:grid-cols-4">
        {Object.entries(stageSummary).map(([stage, count]) => (
          <div key={stage} className="rounded-md border border-border bg-card p-3 text-sm">
            <p className="text-xs text-muted-foreground">{stage}</p>
            <p className="text-lg font-semibold">{count}</p>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active Deal Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {deals.map((deal) => (
            <div key={deal.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3 text-sm">
              <span className="font-medium">{deal.name}</span>
              <Badge variant={deal.stage === "Closed" ? "success" : "glass"}>{deal.stage}</Badge>
              <select
                value={deal.stage}
                onChange={(e) => setDealStage(deal.id, e.target.value as DealStage)}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs"
              >
                <option>Under Contract</option>
                <option>Due Diligence</option>
                <option>Financing</option>
                <option>Closed</option>
              </select>
              <span className="text-xs text-muted-foreground">{deal.eta}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

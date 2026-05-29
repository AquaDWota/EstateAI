"use client";

import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Percent,
  TrendingUp,
  Wallet,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  AppreciationChart,
  RentalDemandChart,
} from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyMap } from "@/components/maps/property-map";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import type { PropertyData } from "@/lib/property-generator";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { MarketNewsFeed } from "@/components/dashboard/market-news";

type DashboardData = {
  portfolio: {
    totalValue: number;
    monthlyCashFlow: number;
    roi: number;
    rentalYield: number;
    propertyCount: number;
  };
  marketSentimentIndex: number;
  aiOpportunityFeed: {
    id: string;
    title: string;
    message: string;
    aiScore: number;
    type: "opportunity" | "insight";
  }[];
  topOpportunities: PropertyData[];
  undervaluedCount: number;
  charts: {
    appreciation: { month: string; value: number }[];
    rentalDemand: { month: string; demand: number }[];
  };
  heatmap: PropertyData[];
  economicIndicators: Record<string, number>;
  aiConfidenceScore: number;
  riskScore: number;
};

export default function DashboardPage() {
  const timeRange = useAppStore((s) => s.timeRange);
  const setTimeRange = useAppStore((s) => s.setTimeRange);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiFetch<DashboardData>("/dashboard"),
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Dashboard data is unavailable right now.
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const topOpps = data.topOpportunities as PropertyData[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investor Dashboard</h1>
          <p className="text-slate-500">Multi-market real estate intelligence</p>
        </div>
        <div className="flex gap-2">
          {(["1M", "3M", "6M", "1Y", "ALL"] as const).map((r) => (
            <Button
              key={r}
              variant={timeRange === r ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Portfolio Value"
          value={formatCurrency(data.portfolio.totalValue)}
          change="+12.4% YoY"
          icon={Wallet}
          trend="up"
        />
        <MetricCard
          title="Monthly Cash Flow"
          value={formatCurrency(data.portfolio.monthlyCashFlow)}
          change="+8.2% vs last month"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Portfolio ROI"
          value={`${data.portfolio.roi}%`}
          change="Above market avg"
          icon={Percent}
          trend="up"
        />
        <MetricCard
          title="Rental Yield"
          value={`${data.portfolio.rentalYield}%`}
          icon={TrendingUp}
          trend="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property appreciation</CardTitle>
          </CardHeader>
          <CardContent>
            <AppreciationChart data={data.charts.appreciation} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-violet-600" />
              Market sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-5xl font-bold text-violet-600">
                {data.marketSentimentIndex}
              </p>
              <p className="text-sm text-slate-500">/ 100 index</p>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">AI confidence</span>
                <span className="font-semibold">{data.aiConfidenceScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Portfolio risk</span>
                <span className="font-semibold text-amber-600">{data.riskScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Undervalued</span>
                <span className="font-semibold">{data.undervaluedCount} properties</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rental demand</CardTitle>
          </CardHeader>
          <CardContent>
            <RentalDemandChart data={data.charts.rentalDemand} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Economic indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {Object.entries(data.economicIndicators).map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs capitalize text-slate-500">
                  {k.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {typeof v === "number" && k.includes("Rate") ? `${v}%` : v}
                  {typeof v === "number" && k.includes("Growth") ? "%" : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>AI opportunity feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.aiOpportunityFeed.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <Badge variant={item.type === "opportunity" ? "success" : "default"}>
                    AI {item.aiScore}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">{item.message}</p>
                <Link
                  href={`/properties/${item.id}`}
                  className="mt-2 inline-block text-xs font-medium text-violet-600"
                >
                  View property →
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Investment heatmap</CardTitle>
            <Link href="/map" className="text-sm text-violet-600 hover:underline">
              Full map
            </Link>
          </CardHeader>
          <CardContent>
            <PropertyMap properties={data.heatmap} height="320px" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Top opportunities</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {topOpps.slice(0, 2).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
        <MarketNewsFeed />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">More opportunities</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topOpps.slice(2, 5).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

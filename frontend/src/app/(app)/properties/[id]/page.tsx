"use client";

import { use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bed,
  Bath,
  Maximize,
  School,
  Shield,
  Train,
  Users,
  Bookmark,
} from "lucide-react";
import { getLocalProperty, getLocalProperties } from "@/lib/api-local";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MortgageCalculator } from "@/components/properties/mortgage-calculator";
import { PropertyMap } from "@/components/maps/property-map";
import { useAppStore } from "@/store/use-app-store";
import { PropertyCard } from "@/components/properties/property-card";
import { notFound } from "next/navigation";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const property = getLocalProperty(id);
  const watchlist = useAppStore((s) => s.watchlist);
  const addToWatchlist = useAppStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);

  const comparables = useMemo(() => {
    if (!property) return [];
    return getLocalProperties({ propertyType: property.propertyType }).filter(
      (p) => p.id !== id
    ).slice(0, 3);
  }, [property, id]);

  if (!property) notFound();

  const onWatchlist = watchlist.includes(id);
  const recColor =
    property.aiRecommendation === "BUY"
      ? "success"
      : property.aiRecommendation === "AVOID"
        ? "danger"
        : "warning";

  return (
    <div className="space-y-8">
      <Link href="/properties" className="text-sm text-violet-600 hover:underline">
        ← Back to listings
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={property.imageUrl}
              alt={property.address}
              fill
              className="object-cover"
              priority
            />
            {property.undervalued && (
              <Badge variant="success" className="absolute left-4 top-4">
                Undervalued
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {property.images.map((img, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={img} alt="" fill className="object-cover" sizes="200px" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{property.address}</h1>
              <p className="text-slate-500">
                {property.city}, {property.state} {property.zipCode}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onWatchlist ? removeFromWatchlist(id) : addToWatchlist(id)
              }
            >
              <Bookmark
                className={onWatchlist ? "fill-violet-600 text-violet-600" : ""}
              />
            </Button>
          </div>
          <p className="mt-4 text-3xl font-bold text-violet-600">
            {formatCurrency(property.price)}
          </p>
          <div className="mt-4 flex flex-wrap gap-6 text-slate-600">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {property.beds} beds
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.baths} baths
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" /> {property.sqft.toLocaleString()} sqft
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "ROI", value: `${property.estimatedRoi}%` },
              { label: "Cap rate", value: `${property.capRate}%` },
              { label: "Yield", value: `${property.rentalYield}%` },
              { label: "AI score", value: property.aiScore },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-slate-900">{m.value}</p>
                <p className="text-xs text-slate-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI recommendation</CardTitle>
            <Badge variant={recColor}>{property.aiRecommendation}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-700">
          <p>
            <strong>Confidence:</strong> {property.confidence}%
          </p>
          <p>
            <strong>Thesis:</strong> {property.investmentThesis}
          </p>
          <p>
            <strong>Risk:</strong> {property.riskExplanation}
          </p>
          <p>
            <strong>Exit strategy:</strong> {property.exitStrategy}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Historical pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={property.historicalPrices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#7c3aed"
                  fill="#7c3aed33"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Neighborhood insights</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <School className="h-8 w-8 text-violet-600" />
              <div>
                <p className="text-xs text-slate-500">School rating</p>
                <p className="font-bold">{property.schoolRating}/10</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Shield className="h-8 w-8 text-violet-600" />
              <div>
                <p className="text-xs text-slate-500">Crime index</p>
                <p className="font-bold">{property.crimeIndex}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Train className="h-8 w-8 text-violet-600" />
              <div>
                <p className="text-xs text-slate-500">Transit score</p>
                <p className="font-bold">{property.transitScore}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Users className="h-8 w-8 text-violet-600" />
              <div>
                <p className="text-xs text-slate-500">Median income</p>
                <p className="font-bold">
                  {formatCurrency(property.demographics.medianIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cash flow estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm text-slate-500">Monthly rent</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(property.monthlyRent)}
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 p-4">
                <p className="text-sm text-slate-500">Net cash flow</p>
                <p className="text-2xl font-bold text-violet-700">
                  {formatCurrency(property.monthlyCashFlow)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Rental demand index: {property.rentalDemand}/100 · Appreciation
              forecast: {property.appreciationForecast}%
            </p>
          </CardContent>
        </Card>
        <MortgageCalculator defaultPrice={property.price} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyMap properties={[property]} height="280px" />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold">Comparable properties</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {comparables.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, TrendingUp, BookmarkPlus, GitCompareArrows } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PropertyData } from "@/lib/property-generator";
import { formatCurrency } from "@/lib/utils";
import { InvestmentScoreBadge } from "@/components/ai/investment-score-badge";

export function PropertyCard({
  property,
  compact = false,
  selected = false,
}: {
  property: PropertyData;
  compact?: boolean;
  selected?: boolean;
}) {
  if (compact) {
    return (
      <Link href={`/properties/${property.id}`}>
        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260 }}>
          <Card
            className={`group overflow-hidden transition-all hover:shadow-md ${
            selected ? "ring-2 ring-violet-500" : ""
          }`}
          >
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={property.imageUrl}
                  alt={property.address}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="140px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {property.address}
                  </p>
                  <InvestmentScoreBadge score={property.aiScore} />
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {property.city}, {property.state}
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatCurrency(property.price)}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {property.beds} bd • {property.baths} ba •{" "}
                  {property.sqft.toLocaleString()} sqft
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  {property.estimatedRoi}% ROI • {property.capRate}% cap
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 220 }}>
        <Card className="group overflow-hidden transition-all hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.address}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {property.undervalued && (
            <Badge variant="success" className="absolute left-3 top-3">
              Undervalued
            </Badge>
          )}
          <div className="absolute right-3 top-3">
            <InvestmentScoreBadge score={property.aiScore} />
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-lg font-semibold text-slate-900">{property.address}</p>
          <p className="text-sm text-slate-500">
            {property.city}, {property.state} {property.zipCode}
          </p>
          <p className="mt-2 text-2xl font-bold text-violet-600">
            {formatCurrency(property.price)}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {property.beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.baths}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" /> {property.sqft.toLocaleString()} sqft
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3 text-center text-xs">
            <div>
              <p className="font-semibold text-slate-900">{property.estimatedRoi}%</p>
              <p className="text-slate-500">ROI</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{property.capRate}%</p>
              <p className="text-slate-500">Cap</p>
            </div>
            <div>
              <p className="font-semibold text-emerald-600 flex items-center justify-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                {property.appreciationForecast}%
              </p>
              <p className="text-slate-500">Growth</p>
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
            {property.investmentThesis}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
              onClick={(e) => e.preventDefault()}
            >
              <BookmarkPlus className="h-3 w-3" />
              Save
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
              onClick={(e) => e.preventDefault()}
            >
              <GitCompareArrows className="h-3 w-3" />
              Compare
            </button>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

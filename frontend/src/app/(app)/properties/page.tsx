"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyMap } from "@/components/maps/property-map";
import { apiFetch } from "@/lib/api";
import type { PropertyData } from "@/lib/property-generator";
import { useAppStore } from "@/store/use-app-store";
import { FloatingSearch } from "@/components/ai/floating-search";
import { SmartFilterBar } from "@/components/ai/smart-filter-bar";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { MarketHeatmap } from "@/components/ai/market-heatmap";
import { ROIWidget } from "@/components/ai/roi-widget";
import { NeighborhoodAnalysis } from "@/components/ai/neighborhood-analysis";

export default function PropertiesPage() {
  const [query, setQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const addSavedSearch = useAppStore((s) => s.addSavedSearch);
  const [chipRentalDemand, setChipRentalDemand] = useState(false);
  const [chipLowRisk, setChipLowRisk] = useState(false);
  const [chipUndervalued, setChipUndervalued] = useState(false);
  const [chipLuxury, setChipLuxury] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) setQuery(q);
    }
  }, []);

  const {
    data: filteredProperties = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "properties",
      query,
      chipRentalDemand,
      chipLowRisk,
      chipUndervalued,
      chipLuxury,
    ],
    queryFn: async () => {
      const effectiveQuery = [
        query,
        chipRentalDemand ? "high rental demand" : "",
        chipLowRisk ? "low risk" : "",
        chipUndervalued ? "undervalued" : "",
        chipLuxury ? "luxury homes" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const params = new URLSearchParams();
      params.set("limit", "100");
      if (effectiveQuery) params.set("q", effectiveQuery);
      const payload = await apiFetch<{ items: PropertyData[] }>(
        `/properties?${params.toString()}`,
        { method: "GET" }
      );
      return payload.items;
    },
  });

  const marketCount = useMemo(
    () => new Set(filteredProperties.map((p) => `${p.city}, ${p.state}`)).size,
    [filteredProperties]
  );
  const properties = filteredProperties;

  const mapCenter = useMemo(() => {
    const source = properties;
    if (source.length === 0) return { lat: 39.5, lng: -98.35 };
    const latitude =
      source.reduce((sum, p) => sum + p.latitude, 0) / Math.max(source.length, 1);
    const longitude =
      source.reduce((sum, p) => sum + p.longitude, 0) / Math.max(source.length, 1);
    return { lat: latitude, lng: longitude };
  }, [properties]);

  const selectedProperty =
    properties.find((p) => p.id === selectedPropertyId) || properties[0];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-16 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 xl:grid-cols-[460px_minmax(0,1fr)]">
          <div className="h-[65vh] animate-pulse rounded bg-muted" />
          <div className="h-[65vh] animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Unable to load properties right now.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-2 text-sm font-medium underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Map Intelligence</h1>
          <p className="text-muted-foreground">
            Autonomous deal discovery across {marketCount} US markets
          </p>
        </div>
        <FloatingSearch value={query} onChange={setQuery} />
        <SmartFilterBar
          chips={[
            { label: "High Rental Demand", active: chipRentalDemand, onToggle: () => setChipRentalDemand((v) => !v) },
            { label: "Low Risk", active: chipLowRisk, onToggle: () => setChipLowRisk((v) => !v) },
            { label: "Undervalued", active: chipUndervalued, onToggle: () => setChipUndervalued((v) => !v) },
            { label: "Luxury", active: chipLuxury, onToggle: () => setChipLuxury((v) => !v) },
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[460px_minmax(0,1fr)]">
        <div className="space-y-3 xl:max-h-[calc(100vh-180px)] xl:overflow-y-auto xl:pr-2">
          <p className="text-sm text-muted-foreground">
            Showing {properties.length} properties.
          </p>
          <motion.div className="grid gap-2">
            {properties.map((p, idx) => (
              <motion.div
                key={p.id}
                className="block w-full text-left"
                onMouseEnter={() => setSelectedPropertyId(p.id)}
                onFocus={() => setSelectedPropertyId(p.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx < 12 ? idx * 0.015 : 0, duration: 0.2 }}
              >
                <PropertyCard
                  property={p}
                  compact
                  selected={selectedProperty?.id === p.id}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="space-y-3 xl:sticky xl:top-24">
          <PropertyMap
            properties={properties}
            center={mapCenter}
            height="calc(100vh - 260px)"
            selectedId={selectedProperty?.id}
            onSelect={(id) => setSelectedPropertyId(id)}
          />
          <div className="grid gap-3 lg:grid-cols-2">
            <AIInsightCard
              title="Undervalued Corridor"
              detail="Market Intelligence Agent detected cap-rate mismatch near transit-connected blocks."
              confidence={92}
            />
            <AIInsightCard
              title="Yield Acceleration"
              detail="Projected rental growth suggests 12-month yield upside in this cluster."
              confidence={84}
            />
          </div>
          <MarketHeatmap
            data={properties.slice(0, 18).map((p, i) => ({
              x: p.latitude * 10 + i,
              y: p.longitude * 10 - i,
              z: p.aiScore,
              market: `${p.city}, ${p.state}`,
            }))}
          />
        </div>
      </div>

      {selectedProperty && (
        <div className="grid gap-3 lg:grid-cols-3">
          <ROIWidget
            roi={selectedProperty.estimatedRoi}
            monthlyCashFlow={selectedProperty.monthlyCashFlow}
          />
          <NeighborhoodAnalysis
            schoolRating={selectedProperty.schoolRating}
            crimeIndex={selectedProperty.crimeIndex}
            transitScore={selectedProperty.transitScore}
          />
          <motion.button
            onClick={() => addSavedSearch("AI semantic search", query)}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-border bg-card p-4 text-left shadow-sm"
          >
            <p className="text-sm font-semibold">Save Search Workflow</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Persist this query to trigger autonomous lead and market alerts.
            </p>
          </motion.button>
        </div>
      )}

      <div className="hidden" />
    </div>
  );
}

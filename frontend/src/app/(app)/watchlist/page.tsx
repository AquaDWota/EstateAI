"use client";

import Link from "next/link";
import { useAppStore } from "@/store/use-app-store";
import { MOCK_PROPERTIES } from "@/lib/property-generator";
import { PropertyCard } from "@/components/properties/property-card";
import { Card, CardContent } from "@/components/ui/card";

export default function WatchlistPage() {
  const watchlist = useAppStore((s) => s.watchlist);
  const properties = MOCK_PROPERTIES.filter((p) => watchlist.includes(p.id));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Watchlist</h1>
      {properties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No properties saved yet. Browse{" "}
            <Link href="/properties" className="text-violet-600 hover:underline">
              listings
            </Link>{" "}
            and bookmark opportunities.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

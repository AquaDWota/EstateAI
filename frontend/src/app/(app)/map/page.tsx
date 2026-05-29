"use client";

import { useRouter } from "next/navigation";
import { PropertyMap } from "@/components/maps/property-map";
import { MOCK_PROPERTIES } from "@/lib/property-generator";

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Investment map</h1>
        <p className="text-slate-500">
          National heatmap, investment zones, and property markers
        </p>
      </div>
      <PropertyMap
        properties={MOCK_PROPERTIES}
        height="calc(100vh - 12rem)"
        onSelect={(id) => router.push(`/properties/${id}`)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { zone: "Downtown Core", growth: 82, color: "bg-violet-500" },
          { zone: "Frog Hollow", growth: 74, color: "bg-indigo-500" },
          { zone: "South Green", growth: 71, color: "bg-blue-500" },
        ].map((z) => (
          <div key={z.zone} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${z.color}`} />
              <span className="font-medium text-slate-900">{z.zone}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Growth score: {z.growth}/100</p>
          </div>
        ))}
      </div>
    </div>
  );
}

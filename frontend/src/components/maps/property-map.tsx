"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { PropertyData } from "@/lib/property-generator";

const PropertyMapLeaflet = dynamic(
  () =>
    import("./property-map-leaflet").then(
      (module) => module.PropertyMapLeaflet
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Loading map...
      </div>
    ),
  }
);

interface PropertyMapProps {
  properties: PropertyData[] | { lat: number; lng: number; intensity?: number; price?: number; id?: string }[];
  center?: { lat: number; lng: number };
  height?: string;
  onSelect?: (id: string) => void;
  selectedId?: string;
}

export function PropertyMap({
  properties,
  center = { lat: 39.8283, lng: -98.5795 },
  height = "400px",
  onSelect,
  selectedId,
}: PropertyMapProps) {
  const markers = useMemo(() => {
    return properties.map((p) => {
      const lat = "latitude" in p ? p.latitude : p.lat;
      const lng = "longitude" in p ? p.longitude : p.lng;
      const id = "id" in p ? p.id : undefined;
      const price = "price" in p ? p.price : undefined;
      return { lat, lng, id, price };
    });
  }, [properties]);

  return (
    <PropertyMapLeaflet
      markers={markers}
      center={center}
      height={height}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}

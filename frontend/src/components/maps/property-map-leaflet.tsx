"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { AnimatedMapCluster } from "./animated-map-cluster";

interface MarkerPoint {
  lat: number;
  lng: number;
  id?: string;
  price?: number;
}

function MapViewUpdater({
  center,
  points,
  zoom,
}: {
  center: { lat: number; lng: number };
  points: MarkerPoint[];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
      return;
    }
    map.setView([center.lat, center.lng], zoom);
  }, [map, center, points, zoom]);

  return null;
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvents({
    zoomend(event) {
      onZoom(event.target.getZoom());
    },
  });
  return null;
}

function getPriceIcon(price?: number, selected?: boolean) {
  const text = price ? `$${Math.round(price / 1000)}k` : "•";
  return L.divIcon({
    className: "estate-map-marker",
    html: `<div class="${selected ? "selected" : ""}">${text}</div>`,
    iconSize: [58, 28],
    iconAnchor: [29, 28],
    popupAnchor: [0, -24],
  });
}

export function PropertyMapLeaflet({
  markers,
  center,
  height,
  selectedId,
  onSelect,
}: {
  markers: MarkerPoint[];
  center: { lat: number; lng: number };
  height: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const [zoom, setZoom] = useState(5);

  const clusters = useMemo(() => {
    const cellSize = Math.max(0.03, 0.75 / Math.max(zoom, 1));
    const grouped = new Map<string, MarkerPoint[]>();
    for (const point of markers) {
      const key = `${Math.round(point.lat / cellSize)}:${Math.round(point.lng / cellSize)}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(point);
    }
    return [...grouped.values()].map((group) => {
      const lat = group.reduce((sum, p) => sum + p.lat, 0) / group.length;
      const lng = group.reduce((sum, p) => sum + p.lng, 0) / group.length;
      return { lat, lng, points: group };
    });
  }, [markers, zoom]);

  const key = useMemo(
    () =>
      `${center.lat.toFixed(4)}-${center.lng.toFixed(4)}-${markers.length}-${selectedId ?? ""}`,
    [center, markers.length, selectedId]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200" style={{ height }}>
      <MapContainer
        key={key}
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapViewUpdater center={center} points={markers} zoom={zoom} />
        <ZoomWatcher onZoom={setZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={[center.lat, center.lng]}
          radius={17000}
          pathOptions={{ color: "#C6A47E", fillColor: "#C6A47E", fillOpacity: 0.08 }}
        />
        <Circle
          center={[center.lat + 0.15, center.lng - 0.1]}
          radius={13000}
          pathOptions={{ color: "#4F6B5B", fillColor: "#4F6B5B", fillOpacity: 0.11 }}
        />

        {clusters.map((cluster, i) => {
          if (cluster.points.length > 1 && zoom < 10) {
            return (
              <AnimatedMapCluster
                key={`cluster-${i}`}
                lat={cluster.lat}
                lng={cluster.lng}
                count={cluster.points.length}
              />
            );
          }
          const m = cluster.points[0];
          return (
            <Marker
              key={m.id || i}
              position={[m.lat, m.lng]}
              icon={getPriceIcon(m.price, selectedId === m.id)}
              eventHandlers={{
                click: () => m.id && onSelect?.(m.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -18]} opacity={1}>
                {m.price ? `$${m.price.toLocaleString()}` : "Property"}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

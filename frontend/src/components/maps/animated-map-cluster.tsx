"use client";

import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";

export function AnimatedMapCluster({
  lat,
  lng,
  count,
  onClick,
}: {
  lat: number;
  lng: number;
  count: number;
  onClick?: () => void;
}) {
  const icon = L.divIcon({
    className: "estate-map-cluster",
    html: `<div>${count}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });

  return (
    <Marker position={[lat, lng]} icon={icon} eventHandlers={{ click: onClick }}>
      <Tooltip direction="top" offset={[0, -12]}>
        {count} properties in this zone
      </Tooltip>
    </Marker>
  );
}

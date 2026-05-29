"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const FloatingCommandPalette = dynamic(
  () => import("@/components/ai/floating-command-palette").then((m) => m.FloatingCommandPalette),
  { ssr: false }
);
const FloatingCopilot = dynamic(
  () => import("@/components/ai/floating-copilot").then((m) => m.FloatingCopilot),
  { ssr: false }
);

export function AppOverlays() {
  const pathname = usePathname();
  const isAppSurface =
    pathname.startsWith("/dashboard")
    || pathname.startsWith("/properties")
    || pathname.startsWith("/assistant")
    || pathname.startsWith("/map")
    || pathname.startsWith("/watchlist")
    || pathname.startsWith("/agents")
    || pathname.startsWith("/pipeline")
    || pathname.startsWith("/outreach")
    || pathname.startsWith("/workflows")
    || pathname.startsWith("/control-center")
    || pathname.startsWith("/investment-analytics")
    || pathname.startsWith("/transactions");

  if (!isAppSurface) return null;

  return (
    <>
      <FloatingCommandPalette />
      <FloatingCopilot />
    </>
  );
}

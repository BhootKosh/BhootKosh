"use client";

import dynamic from "next/dynamic";
import type { MapRegionData } from "./IndiaMap";

const IndiaMap = dynamic(
  () => import("./IndiaMap").then((m) => m.IndiaMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] items-center justify-center border-[3px] border-ink bg-ink sm:min-h-[360px]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin border-[3px] border-gold border-t-transparent" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gold">
            Loading map…
          </p>
        </div>
      </div>
    ),
  }
);

export function IndiaMapLazy({
  regions,
  variant = "compact",
}: {
  regions: MapRegionData[];
  variant?: "full" | "compact";
}) {
  return <IndiaMap regions={regions} variant={variant} />;
}

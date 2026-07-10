"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INDIA_MAP_VIEWBOX, INDIA_STATES } from "@/lib/india-map-data";
import { cn } from "@/lib/utils";

export type MapRegionData = {
  slug: string;
  name: string;
  description?: string | null;
  _count?: {
    ghosts: number;
    hauntedPlaces: number;
    stories: number;
  };
  ghosts?: {
    id: string;
    name: string;
    slug: string;
    type: string;
    dangerLevel: string;
  }[];
};

type Props = {
  regions: MapRegionData[];
  variant?: "full" | "compact";
  className?: string;
};

export function IndiaMap({
  regions,
  variant = "full",
  className,
}: Props) {
  const router = useRouter();
  const uid = useId().replace(/:/g, "");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    count: number;
  } | null>(null);

  const regionBySlug = useMemo(() => {
    const map = new Map<string, MapRegionData>();
    regions.forEach((r) => map.set(r.slug, r));
    return map;
  }, [regions]);

  const activeSlug = selected || hovered;
  const activeRegion = activeSlug ? regionBySlug.get(activeSlug) : null;
  const activeMeta = INDIA_STATES.find((s) => s.slug === activeSlug);

  function entryCount(slug: string) {
    const r = regionBySlug.get(slug);
    if (!r?._count) return 0;
    return (
      (r._count.ghosts || 0) +
      (r._count.hauntedPlaces || 0) +
      (r._count.stories || 0)
    );
  }

  function ghostCount(slug: string) {
    return regionBySlug.get(slug)?._count?.ghosts || 0;
  }

  function onStateEnter(
    slug: string,
    name: string,
    e: React.MouseEvent<SVGPathElement>
  ) {
    setHovered(slug);
    const svg = (e.target as SVGPathElement).ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      name,
      count: ghostCount(slug),
    });
  }

  function onStateMove(e: React.MouseEvent<SVGPathElement>) {
    if (!tooltip) return;
    const svg = (e.target as SVGPathElement).ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setTooltip((t) =>
      t
        ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top }
        : null
    );
  }

  function onStateLeave() {
    setHovered(null);
    setTooltip(null);
  }

  function onStateClick(slug: string) {
    if (variant === "compact") {
      const region = regionBySlug.get(slug);
      router.push(region ? `/regions/${slug}` : "/regions");
      return;
    }
    setSelected(slug);
  }

  const statesWithEntries = INDIA_STATES.filter((s) => entryCount(s.slug) > 0);

  return (
    <div
      className={cn(
        "grid gap-4",
        variant === "full" ? "lg:grid-cols-[1.15fr_0.85fr]" : "",
        className
      )}
    >
      <div className="relative overflow-hidden border-[3px] border-ink bg-bg-page shadow-[4px_4px_0_0_#0a0a0a]">
        <div className="border-b-[3px] border-ink bg-gold px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-sm uppercase text-ink sm:text-base">
              Map of India
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink/70">
              Click a state · explore folklore
            </p>
          </div>
        </div>

        <div className="relative p-3 sm:p-5">
          <div className="relative mx-auto w-full max-w-xl">
            <svg
              viewBox={INDIA_MAP_VIEWBOX}
              className="relative z-[1] h-auto w-full"
              role="img"
              aria-label="Map of India — select a state"
            >
              <defs>
                <linearGradient id={`${uid}-idle`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e8dcc4" />
                  <stop offset="100%" stopColor="#d4c4a8" />
                </linearGradient>
              </defs>

              {INDIA_STATES.map((state) => {
                const hasData = entryCount(state.slug) > 0;
                const isActive = activeSlug === state.slug;

                return (
                  <path
                    key={state.slug}
                    d={state.d}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selected === state.slug}
                    aria-label={`${state.name}${
                      hasData
                        ? `, ${ghostCount(state.slug)} spirits`
                        : ", no entries yet"
                    }`}
                    className={cn(
                      "cursor-pointer outline-none transition-[fill,stroke] duration-100 focus:stroke-[3]",
                      isActive
                        ? "stroke-ink stroke-[2.5]"
                        : "stroke-ink stroke-[1.4] hover:stroke-[2]"
                    )}
                    fill={
                      isActive
                        ? "#e85d04"
                        : hasData
                          ? "#f4c430"
                          : `url(#${uid}-idle)`
                    }
                    onMouseEnter={(e) =>
                      onStateEnter(state.slug, state.name, e)
                    }
                    onMouseMove={onStateMove}
                    onMouseLeave={onStateLeave}
                    onClick={() => onStateClick(state.slug)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onStateClick(state.slug);
                      }
                    }}
                    onFocus={() => setHovered(state.slug)}
                    onBlur={() => setHovered(null)}
                  />
                );
              })}
            </svg>

            {tooltip && (
              <div
                role="tooltip"
                className="pointer-events-none absolute z-20 border-[3px] border-ink bg-white px-3 py-2 shadow-[4px_4px_0_0_#0a0a0a]"
                style={{
                  left: Math.min(Math.max(tooltip.x + 12, 8), 220),
                  top: Math.max(tooltip.y - 56, 8),
                }}
              >
                <p className="font-display text-xs uppercase text-ink">
                  {tooltip.name}
                </p>
                <p className="mt-0.5 text-[11px] font-bold text-saffron">
                  {tooltip.count > 0
                    ? `${tooltip.count} spirit${tooltip.count === 1 ? "" : "s"}`
                    : "No entries yet"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 border-t-[3px] border-ink pt-3 text-[10px] font-bold uppercase tracking-wide text-ink">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 border-2 border-ink bg-gold" />
              Has entries
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 border-2 border-ink bg-[#d4c4a8]" />
              Empty
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 border-2 border-ink bg-saffron" />
              Selected
            </span>
          </div>
        </div>
      </div>

      {variant === "full" && (
        <aside className="flex min-h-[400px] flex-col border-[3px] border-ink bg-bg-page shadow-[4px_4px_0_0_#0a0a0a]">
          {!activeMeta ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <span className="border-[3px] border-ink bg-accent-cyan px-3 py-1 font-display text-xs uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
                Select a state
              </span>
              <h2 className="mt-4 font-display text-2xl uppercase text-ink">
                Regional archive
              </h2>
              <p className="mt-2 max-w-xs font-serif text-sm text-muted">
                Choose a state on the map to preview spirits, places, and
                stories.
              </p>
              {statesWithEntries.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {statesWithEntries.map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setSelected(s.slug)}
                      className="border-2 border-ink bg-white px-2 py-1 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a] hover:bg-gold"
                    >
                      {s.name} ({ghostCount(s.slug)})
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <span className="w-fit border-2 border-ink bg-saffron px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-[2px_2px_0_0_#0a0a0a]">
                State
              </span>
              <h2 className="mt-3 font-display text-2xl uppercase text-ink sm:text-3xl">
                {activeMeta.name}
              </h2>
              <p className="mt-2 font-serif text-sm text-ink/85">
                {activeRegion?.description ||
                  (activeRegion
                    ? "Local folklore entries for this state."
                    : "No archive region has been created for this state yet.")}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["Ghosts", activeRegion?._count?.ghosts ?? 0],
                  ["Places", activeRegion?._count?.hauntedPlaces ?? 0],
                  ["Stories", activeRegion?._count?.stories ?? 0],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    className="border-[3px] border-ink bg-white p-2 text-center shadow-[2px_2px_0_0_#0a0a0a]"
                  >
                    <p className="font-display text-xl text-ink">{value}</p>
                    <p className="text-[9px] font-bold uppercase text-muted">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {activeRegion?.ghosts && activeRegion.ghosts.length > 0 && (
                <ul className="mt-4 max-h-40 space-y-2 overflow-y-auto">
                  {activeRegion.ghosts.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/ghosts/${g.slug}`}
                        className="flex items-center justify-between border-2 border-ink bg-white px-2 py-1.5 text-sm font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a] hover:bg-gold"
                      >
                        <span>{g.name}</span>
                        <span className="text-[10px]">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {activeRegion ? (
                  <>
                    <Link
                      href={`/regions/${activeRegion.slug}`}
                      className="brutal-btn brutal-btn-primary !min-h-10 !text-[11px]"
                    >
                      Open region
                    </Link>
                    <Link
                      href={`/ghosts?region=${activeRegion.slug}`}
                      className="brutal-btn brutal-btn-ghost !min-h-10 !text-[11px]"
                    >
                      All ghosts
                    </Link>
                  </>
                ) : (
                  <p className="text-xs font-bold uppercase text-muted">
                    Add this region in admin
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      )}

      {variant === "compact" && (
        <p className="text-center text-[11px] font-bold uppercase tracking-wide text-ink">
          Gold states have archive entries ·{" "}
          <Link
            href="/regions"
            className="underline decoration-2 underline-offset-2"
          >
            Full map →
          </Link>
        </p>
      )}
    </div>
  );
}

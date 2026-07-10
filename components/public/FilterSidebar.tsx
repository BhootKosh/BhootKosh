"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  dangerLabel,
  ghostTypeLabel,
  GHOST_TYPES,
  DANGER_LEVELS,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Filter, RotateCcw, X, SlidersHorizontal, Sparkles } from "lucide-react";

export function FilterSidebar({
  regions = [],
  showType = true,
  showDanger = true,
  showRegion = true,
  showSort = true,
}: {
  regions?: { slug: string; name: string }[];
  showType?: boolean;
  showDanger?: boolean;
  showRegion?: boolean;
  showSort?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const type = searchParams.get("type") || "";
  const region = searchParams.get("region") || "";
  const danger = searchParams.get("danger") || "";
  const habitat = searchParams.get("habitat") || "";
  const sort = searchParams.get("sort") || "newest";

  const activeCount = useMemo(() => {
    let n = 0;
    if (type) n++;
    if (region) n++;
    if (danger) n++;
    if (habitat) n++;
    if (sort && sort !== "newest") n++;
    return n;
  }, [type, region, danger, habitat, sort]);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggle(key: string, value: string) {
    const current = searchParams.get(key) || "";
    update(key, current === value ? "" : value);
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const selectClass =
    "w-full min-h-11 border-[3px] border-ink bg-white px-3 py-2.5 text-sm font-bold text-ink shadow-[3px_3px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron appearance-none";

  const fields = (variant: "desktop" | "mobile") => (
    <div className={cn("space-y-4", variant === "desktop" && "space-y-5")}>
      {showType && (
        <FieldBlock label="Spirit type" accent="cyan">
          <div className="flex flex-wrap gap-2">
            <Chip
              active={!type}
              onClick={() => update("type", "")}
              tone="white"
            >
              All
            </Chip>
            {GHOST_TYPES.map((t) => (
              <Chip
                key={t}
                active={type === t}
                onClick={() => toggle("type", t)}
                tone="cyan"
              >
                {ghostTypeLabel(t)}
              </Chip>
            ))}
          </div>
        </FieldBlock>
      )}

      {showDanger && (
        <FieldBlock label="Danger level" accent="saffron">
          <div className="grid grid-cols-2 gap-2">
            <Chip
              active={!danger}
              onClick={() => update("danger", "")}
              tone="white"
              className="col-span-2 justify-center"
            >
              All levels
            </Chip>
            {DANGER_LEVELS.map((d) => (
              <Chip
                key={d}
                active={danger === d}
                onClick={() => toggle("danger", d)}
                tone={
                  d === "EXTREME" || d === "HIGH"
                    ? "saffron"
                    : d === "MEDIUM"
                      ? "gold"
                      : "green"
                }
                className="justify-center"
              >
                {dangerLabel(d)}
              </Chip>
            ))}
          </div>
        </FieldBlock>
      )}

      {showRegion && regions.length > 0 && (
        <FieldBlock label="Region" accent="gold">
          <select
            className={selectClass}
            value={region}
            onChange={(e) => update("region", e.target.value)}
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </FieldBlock>
      )}

      <FieldBlock label="Habitat" accent="pink">
        <input
          className={selectClass}
          placeholder="forest, fort, river…"
          defaultValue={habitat}
          key={habitat}
          onBlur={(e) => update("habitat", e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update("habitat", (e.target as HTMLInputElement).value.trim());
            }
          }}
        />
      </FieldBlock>

      {showSort && (
        <FieldBlock label="Sort by" accent="ink">
          <div className="grid grid-cols-1 gap-2">
            {(
              [
                ["newest", "Newest"],
                ["name", "Name A–Z"],
                ["popularity", "Most viewed"],
              ] as const
            ).map(([value, label]) => (
              <Chip
                key={value}
                active={sort === value}
                onClick={() => update("sort", value === "newest" ? "" : value)}
                tone="gold"
                className="w-full justify-center"
              >
                {label}
              </Chip>
            ))}
          </div>
        </FieldBlock>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="flex w-full min-h-12 items-center justify-center gap-2 border-[3px] border-ink bg-white px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5"
        >
          <RotateCcw size={15} strokeWidth={2.5} />
          Reset all ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter trigger */}
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full min-h-12 items-center justify-between border-[3px] border-ink bg-gold px-4 py-3 text-sm font-bold uppercase text-ink shadow-[4px_4px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5"
        >
          <span className="inline-flex items-center gap-2">
            <Filter size={18} />
            Filters
            {activeCount > 0 && (
              <span className="border-2 border-ink bg-ink px-1.5 py-0.5 text-[10px] text-gold">
                {activeCount}
              </span>
            )}
          </span>
          <span className="text-[10px] tracking-wider text-ink/70">Open</span>
        </button>
      </div>

      {/* ── Desktop neo-brutal sticky sidebar ── */}
      <aside className="sidebar-sticky no-scrollbar relative hidden lg:block">
        {/* offset hard-shadow slab behind panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 bg-ink"
        />
        <div className="relative border-[3px] border-ink bg-bg-page">
          {/* top stamp bar */}
          <div className="relative overflow-hidden border-b-[3px] border-ink bg-saffron px-4 py-3">
            <div className="pointer-events-none absolute inset-0 halftone opacity-20" />
            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center border-[3px] border-ink bg-gold shadow-[3px_3px_0_0_#0a0a0a]">
                  <SlidersHorizontal size={16} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="font-display text-sm uppercase leading-none text-ink">
                    Sidebar
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink/70">
                    Customize feed
                  </p>
                </div>
              </div>
              {activeCount > 0 ? (
                <span className="border-[3px] border-ink bg-ink px-2 py-1 text-[10px] font-bold uppercase text-gold shadow-[2px_2px_0_0_#f4c430]">
                  {activeCount} live
                </span>
              ) : (
                <span className="border-[2px] border-ink bg-white px-2 py-1 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]">
                  Default
                </span>
              )}
            </div>
          </div>

          {/* active filter stamps */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-1.5 border-b-[3px] border-ink bg-gold/40 px-3 py-2.5">
              {type && (
                <ActiveStamp onClear={() => update("type", "")}>
                  {ghostTypeLabel(type)}
                </ActiveStamp>
              )}
              {danger && (
                <ActiveStamp onClear={() => update("danger", "")}>
                  {dangerLabel(danger)}
                </ActiveStamp>
              )}
              {region && (
                <ActiveStamp onClear={() => update("region", "")}>
                  {regions.find((r) => r.slug === region)?.name || region}
                </ActiveStamp>
              )}
              {habitat && (
                <ActiveStamp onClear={() => update("habitat", "")}>
                  {habitat}
                </ActiveStamp>
              )}
              {sort !== "newest" && (
                <ActiveStamp onClear={() => update("sort", "")}>
                  {sort}
                </ActiveStamp>
              )}
            </div>
          )}

          {/* body */}
          <div className="space-y-1 p-4">
            <div className="mb-3 flex items-start gap-2 border-[3px] border-ink bg-accent-cyan/50 p-2.5 shadow-[3px_3px_0_0_#0a0a0a]">
              <Sparkles size={14} className="mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold leading-snug text-ink">
                Click chips to filter the encyclopedia. Hard edges, zero fluff.
              </p>
            </div>
            {fields("desktop")}
          </div>

          {/* bottom bar */}
          <div className="border-t-[3px] border-ink bg-ink px-3 py-2.5">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
              BhootKosh · Filters
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="backdrop-enter absolute inset-0 bg-ink/55"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div className="sheet-enter absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto border-t-[3px] border-ink bg-bg-page pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_0_0_#0a0a0a]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-ink bg-saffron px-4 py-3">
              <h2 className="font-display text-base uppercase text-ink">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center border-[3px] border-ink bg-white shadow-[2px_2px_0_0_#0a0a0a]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4">{fields("mobile")}</div>
            <div className="px-4 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="brutal-btn brutal-btn-primary w-full"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FieldBlock({
  label,
  accent,
  children,
}: {
  label: string;
  accent: "cyan" | "saffron" | "gold" | "pink" | "ink";
  children: React.ReactNode;
}) {
  const bar =
    accent === "cyan"
      ? "bg-accent-cyan"
      : accent === "saffron"
        ? "bg-saffron"
        : accent === "gold"
          ? "bg-gold"
          : accent === "pink"
            ? "bg-accent-pink"
            : "bg-ink text-gold";

  return (
    <div className="border-[3px] border-ink bg-white shadow-[4px_4px_0_0_#0a0a0a]">
      <div
        className={cn(
          "border-b-[3px] border-ink px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink",
          bar
        )}
      >
        {label}
      </div>
      <div className="p-2.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  tone = "white",
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "white" | "cyan" | "saffron" | "gold" | "green";
  className?: string;
}) {
  const idle =
    tone === "cyan"
      ? "bg-accent-cyan/40 hover:bg-accent-cyan"
      : tone === "saffron"
        ? "bg-saffron/15 hover:bg-saffron/30"
        : tone === "gold"
          ? "bg-gold/40 hover:bg-gold"
          : tone === "green"
            ? "bg-danger-low/15 hover:bg-danger-low/25"
            : "bg-bg-page hover:bg-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center border-[2px] border-ink px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide shadow-[2px_2px_0_0_#0a0a0a] transition hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#0a0a0a]",
        active ? "bg-ink text-gold" : cn("text-ink", idle),
        className
      )}
    >
      {children}
    </button>
  );
}

function ActiveStamp({
  children,
  onClear,
}: {
  children: React.ReactNode;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1 border-[2px] border-ink bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a] hover:bg-saffron hover:text-white"
      title="Remove filter"
    >
      {children}
      <X size={11} strokeWidth={3} />
    </button>
  );
}

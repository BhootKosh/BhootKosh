"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  dangerLabel,
  ghostTypeLabel,
  GHOST_TYPES,
  DANGER_LEVELS,
} from "@/lib/utils";
import { Filter, RotateCcw, X } from "lucide-react";

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

  const activeCount = useMemo(() => {
    let n = 0;
    if (searchParams.get("type")) n++;
    if (searchParams.get("region")) n++;
    if (searchParams.get("danger")) n++;
    if (searchParams.get("habitat")) n++;
    if (searchParams.get("sort") && searchParams.get("sort") !== "newest") n++;
    return n;
  }, [searchParams]);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
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
    "w-full min-h-11 border-[3px] border-ink bg-white px-3 py-2.5 text-sm font-medium text-ink shadow-[2px_2px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron";

  const fields = (
    <div className="space-y-4">
      {showType && (
        <Field label="Type">
          <select
            className={selectClass}
            value={searchParams.get("type") || ""}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="">All types</option>
            {GHOST_TYPES.map((t) => (
              <option key={t} value={t}>
                {ghostTypeLabel(t)}
              </option>
            ))}
          </select>
        </Field>
      )}

      {showRegion && regions.length > 0 && (
        <Field label="Region">
          <select
            className={selectClass}
            value={searchParams.get("region") || ""}
            onChange={(e) => update("region", e.target.value)}
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      {showDanger && (
        <Field label="Danger level">
          <select
            className={selectClass}
            value={searchParams.get("danger") || ""}
            onChange={(e) => update("danger", e.target.value)}
          >
            <option value="">All levels</option>
            {DANGER_LEVELS.map((d) => (
              <option key={d} value={d}>
                {dangerLabel(d)}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Habitat">
        <input
          className={selectClass}
          placeholder="e.g. forest, fort…"
          defaultValue={searchParams.get("habitat") || ""}
          onBlur={(e) => update("habitat", e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update("habitat", (e.target as HTMLInputElement).value.trim());
            }
          }}
        />
      </Field>

      {showSort && (
        <Field label="Sort">
          <select
            className={selectClass}
            value={searchParams.get("sort") || "newest"}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
            <option value="popularity">Most viewed</option>
          </select>
        </Field>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="flex w-full min-h-11 items-center justify-center gap-2 border-[3px] border-ink bg-white px-3 py-2 text-xs font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a] transition active:translate-x-0.5 active:translate-y-0.5"
        >
          <RotateCcw size={14} />
          Clear filters ({activeCount})
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
          <span className="text-[10px] tracking-wider text-ink/70">
            Customize
          </span>
        </button>
      </div>

      {/* Desktop sticky sidebar — original simple panel */}
      <aside className="sidebar-sticky no-scrollbar hidden space-y-4 border-[3px] border-ink bg-gold p-4 shadow-[4px_4px_0_0_#0a0a0a] lg:block">
        <div className="flex items-center justify-between gap-2 border-b-[3px] border-ink pb-3">
          <h2 className="font-display text-sm uppercase text-ink">
            Customize
          </h2>
          {activeCount > 0 && (
            <span className="border-2 border-ink bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase text-gold">
              {activeCount} on
            </span>
          )}
        </div>
        <p className="text-[11px] font-medium leading-snug text-ink/70">
          Tune the encyclopedia feed — type, region, danger & sort order.
        </p>
        {fields}
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
          <div className="sheet-enter absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto border-t-[3px] border-ink bg-bg-page p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_0_0_#0a0a0a]">
            <div className="mb-4 flex items-center justify-between">
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
            {fields}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="brutal-btn brutal-btn-primary mt-5 w-full"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-ink/70">
        {label}
      </label>
      {children}
    </div>
  );
}

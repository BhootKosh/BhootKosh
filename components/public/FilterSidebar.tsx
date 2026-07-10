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
import { BrutalSelect } from "@/components/ui/BrutalSelect";

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

  const typeOptions = useMemo(
    () => [
      { value: "", label: "All types" },
      ...GHOST_TYPES.map((t) => ({ value: t, label: ghostTypeLabel(t) })),
    ],
    []
  );

  const regionOptions = useMemo(
    () => [
      { value: "", label: "All regions" },
      ...regions.map((r) => ({ value: r.slug, label: r.name })),
    ],
    [regions]
  );

  const dangerOptions = useMemo(
    () => [
      { value: "", label: "All levels" },
      ...DANGER_LEVELS.map((d) => ({ value: d, label: dangerLabel(d) })),
    ],
    []
  );

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "name", label: "Name A–Z" },
    { value: "popularity", label: "Most viewed" },
  ];

  const inputClass =
    "w-full min-h-12 border-[3px] border-ink bg-white px-3 py-2.5 text-sm font-bold text-ink shadow-[3px_3px_0_0_#0a0a0a] placeholder:font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-saffron";

  const fields = (
    <div className="space-y-4">
      {showType && (
        <Field label="Type">
          <BrutalSelect
            aria-label="Spirit type"
            value={type}
            onChange={(v) => update("type", v)}
            options={typeOptions}
            placeholder="All types"
          />
        </Field>
      )}

      {showRegion && regions.length > 0 && (
        <Field label="Region">
          <BrutalSelect
            aria-label="Region"
            value={region}
            onChange={(v) => update("region", v)}
            options={regionOptions}
            placeholder="All regions"
          />
        </Field>
      )}

      {showDanger && (
        <Field label="Danger level">
          <BrutalSelect
            aria-label="Danger level"
            value={danger}
            onChange={(v) => update("danger", v)}
            options={dangerOptions}
            placeholder="All levels"
          />
        </Field>
      )}

      <Field label="Habitat">
        <input
          className={inputClass}
          placeholder="e.g. forest, fort…"
          defaultValue={habitat}
          key={habitat}
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
          <BrutalSelect
            aria-label="Sort"
            value={sort}
            onChange={(v) => update("sort", v === "newest" ? "" : v)}
            options={sortOptions}
          />
        </Field>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="flex w-full min-h-12 items-center justify-center gap-2 border-[3px] border-ink bg-white px-3 py-2.5 text-xs font-bold uppercase text-ink shadow-[4px_4px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5"
        >
          <RotateCcw size={14} />
          Clear filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile */}
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

      {/* Desktop neo-brutal sticky sidebar */}
      {/* Desktop sticky filters — clean, no custom scroll chrome */}
      <aside className="sidebar-sticky hidden space-y-4 border-[3px] border-ink bg-gold p-4 shadow-[4px_4px_0_0_#0a0a0a] lg:block">
        <div className="flex items-center justify-between gap-2 border-b-[3px] border-ink pb-3">
          <h2 className="font-display text-sm uppercase text-ink">Filters</h2>
          {activeCount > 0 && (
            <span className="border-2 border-ink bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase text-gold">
              {activeCount} on
            </span>
          )}
        </div>
        {fields}
      </aside>

      {/* Mobile sheet */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="backdrop-enter absolute inset-0 bg-ink/55"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div className="sheet-enter absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto border-t-[3px] border-ink bg-bg-page pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_0_0_#0a0a0a]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-ink bg-gold px-4 py-3">
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
            <div className="p-4">{fields}</div>
            <div className="px-4 pb-3">
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

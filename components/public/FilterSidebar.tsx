"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  dangerLabel,
  ghostTypeLabel,
  DANGER_LEVELS,
  GHOST_TYPES,
} from "@/lib/utils";
import {
  Filter,
  Flame,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  SortAsc,
  Tag,
  X,
} from "lucide-react";
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
  const [habitatDraft, setHabitatDraft] = useState(habitat);

  const sortOptions = useMemo(
    () => [
      { value: "newest", label: "Newest" },
      { value: "name", label: "Name A-Z" },
      { value: "popularity", label: "Most viewed" },
    ],
    []
  );

  const activeCount = useMemo(() => {
    let n = 0;
    if (type) n++;
    if (region) n++;
    if (danger) n++;
    if (habitat) n++;
    if (sort && sort !== "newest") n++;
    return n;
  }, [type, region, danger, habitat, sort]);

  const activeFilters = useMemo(
    () =>
      [
        type && ghostTypeLabel(type),
        region && regions.find((r) => r.slug === region)?.name,
        danger && dangerLabel(danger),
        habitat && habitat,
        sort !== "newest" && sortOptions.find((o) => o.value === sort)?.label,
      ].filter(Boolean) as string[],
    [type, region, regions, danger, habitat, sort, sortOptions]
  );

  useEffect(() => {
    setHabitatDraft(habitat);
  }, [habitat]);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    setHabitatDraft("");
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

  const inputClass =
    "w-full min-h-12 border-[3px] border-ink bg-white px-3 py-2.5 text-sm font-bold text-ink shadow-[3px_3px_0_0_#0a0a0a] placeholder:font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-saffron";

  const fields = (
    <div className="space-y-3.5">
      {activeFilters.length > 0 && (
        <div className="border-[3px] border-ink bg-bg-page p-3 shadow-[3px_3px_0_0_#0a0a0a]">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            Active filters
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map((label) => (
              <span
                key={label}
                className="border-2 border-ink bg-accent-cyan px-2 py-1 text-[10px] font-bold uppercase text-ink shadow-[1px_1px_0_0_#0a0a0a]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {showType && (
        <Field label="Type" icon={<Tag size={14} />}>
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
        <Field label="Region" icon={<MapPin size={14} />}>
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
        <Field label="Danger level" icon={<Flame size={14} />}>
          <BrutalSelect
            aria-label="Danger level"
            value={danger}
            onChange={(v) => update("danger", v)}
            options={dangerOptions}
            placeholder="All levels"
          />
        </Field>
      )}

      <Field label="Habitat" icon={<Search size={14} />}>
        <div className="grid grid-cols-[1fr_48px] gap-2">
          <input
            className={inputClass}
            placeholder="forest, fort, river"
            value={habitatDraft}
            onChange={(e) => setHabitatDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") update("habitat", habitatDraft.trim());
            }}
          />
          <button
            type="button"
            aria-label="Apply habitat filter"
            onClick={() => update("habitat", habitatDraft.trim())}
            className="inline-flex min-h-12 items-center justify-center border-[3px] border-ink bg-saffron text-white shadow-[3px_3px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Search size={17} strokeWidth={3} />
          </button>
        </div>
      </Field>

      {showSort && (
        <Field label="Sort" icon={<SortAsc size={14} />}>
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
          className="flex w-full min-h-12 items-center justify-center gap-2 border-[3px] border-ink bg-white px-3 py-2.5 text-xs font-bold uppercase text-ink shadow-[4px_4px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-gold hover:shadow-[5px_5px_0_0_#0a0a0a] active:translate-x-0.5 active:translate-y-0.5"
        >
          <RotateCcw size={14} />
          Clear filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
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

      <aside className="sidebar-sticky hidden overflow-hidden border-[3px] border-ink bg-bg-card shadow-[6px_6px_0_0_#0a0a0a] lg:block">
        <div className="border-b-[3px] border-ink bg-ink p-4 text-gold">
          <div className="flex items-center justify-between gap-2">
            <h2 className="inline-flex items-center gap-2 font-display text-sm uppercase text-gold">
              <SlidersHorizontal size={16} strokeWidth={3} />
              Filters
            </h2>
            {activeCount > 0 && (
              <span className="border-2 border-gold bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink">
                {activeCount} on
              </span>
            )}
          </div>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold/70">
            Refine the archive
          </p>
        </div>
        <div className="space-y-4 bg-gold/85 p-4">{fields}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="backdrop-enter absolute inset-0 bg-ink/55"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div className="sheet-enter absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto border-t-[3px] border-ink bg-bg-page pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_0_0_#0a0a0a]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-3 text-gold">
              <h2 className="inline-flex items-center gap-2 font-display text-base uppercase text-gold">
                <SlidersHorizontal size={16} strokeWidth={3} />
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center border-[3px] border-ink bg-gold text-ink shadow-[2px_2px_0_0_#0a0a0a]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="bg-gold/85 p-4">{fields}</div>
            <div className="bg-gold/85 px-4 pb-3">
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
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

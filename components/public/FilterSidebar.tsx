"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  dangerLabel,
  ghostTypeLabel,
  GHOST_TYPES,
  DANGER_LEVELS,
} from "@/lib/utils";

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

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const selectClass =
    "w-full border-[3px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink shadow-[2px_2px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron";

  return (
    <aside className="space-y-4 border-[3px] border-ink bg-gold p-4 shadow-[4px_4px_0_0_#0a0a0a]">
      <h2 className="font-display text-sm uppercase text-ink">Filters</h2>

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
            <option value="name">Name</option>
            <option value="popularity">Popularity</option>
          </select>
        </Field>
      )}
    </aside>
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
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink/70">
        {label}
      </label>
      {children}
    </div>
  );
}

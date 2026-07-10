"use client";

import { Select } from "@/components/ui/Select";

export function RegionSelector({
  regions,
  value,
  onChange,
}: {
  regions: { id: string; name: string }[];
  value?: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <Select
      id="regionId"
      label="Region"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Select region"
      options={regions.map((r) => ({ value: r.id, label: r.name }))}
    />
  );
}

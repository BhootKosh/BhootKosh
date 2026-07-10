"use client";

import { useEffect } from "react";
import { createSlug } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

export function SlugInput({
  nameValue,
  slug,
  onSlugChange,
  auto = true,
  error,
}: {
  nameValue: string;
  slug: string;
  onSlugChange: (slug: string) => void;
  auto?: boolean;
  error?: string;
}) {
  useEffect(() => {
    if (auto && nameValue) {
      onSlugChange(createSlug(nameValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue, auto]);

  return (
    <Input
      id="slug"
      label="Slug *"
      value={slug}
      onChange={(e) => onSlugChange(createSlug(e.target.value))}
      error={error}
    />
  );
}

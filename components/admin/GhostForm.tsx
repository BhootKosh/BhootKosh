"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SlugInput } from "@/components/admin/SlugInput";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagSelector } from "@/components/admin/TagSelector";
import { RegionSelector } from "@/components/admin/RegionSelector";
import { RelatedGhostSelector } from "@/components/admin/RelatedGhostSelector";
import {
  createSlug,
  dangerLabel,
  ghostTypeLabel,
  GHOST_TYPES,
  DANGER_LEVELS,
} from "@/lib/utils";
import { toast } from "sonner";

type GhostFormProps = {
  mode: "create" | "edit";
  initial?: Record<string, unknown>;
  regions: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  ghosts: { id: string; name: string }[];
};

export function GhostForm({
  mode,
  initial,
  regions,
  tags,
  ghosts,
}: GhostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState((initial?.name as string) || "");
  const [slug, setSlug] = useState((initial?.slug as string) || "");
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [image, setImage] = useState((initial?.image as string) || "");
  const [fullDescription, setFullDescription] = useState(
    (initial?.fullDescription as string) || ""
  );
  const [status, setStatus] = useState(
    (initial?.status as string) || "DRAFT"
  );
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [regionId, setRegionId] = useState(
    (initial?.regionId as string) || ""
  );
  const [tagIds, setTagIds] = useState<string[]>(
    ((initial?.tags as { id: string }[]) || []).map((t) => t.id)
  );
  const [relatedGhostIds, setRelatedGhostIds] = useState<string[]>(
    ((initial?.relatedGhosts as { id: string }[]) || []).map((g) => g.id)
  );
  const [otherNames, setOtherNames] = useState(
    ((initial?.otherNames as string[]) || []).join(", ")
  );
  const [gallery, setGallery] = useState(
    ((initial?.gallery as string[]) || []).join("\n")
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const payload = {
      name,
      slug: slug || createSlug(name),
      otherNames: otherNames
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      type: form.get("type") as string,
      regionId: regionId || null,
      state: (form.get("state") as string) || null,
      dangerLevel: form.get("dangerLevel") as string,
      habitat: (form.get("habitat") as string) || null,
      appearance: (form.get("appearance") as string) || null,
      behavior: (form.get("behavior") as string) || null,
      origin: (form.get("origin") as string) || null,
      summary: (form.get("summary") as string) || null,
      fullDescription,
      culturalNotes: (form.get("culturalNotes") as string) || null,
      sources: (form.get("sources") as string) || null,
      image: image || null,
      gallery: gallery
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tagIds,
      relatedGhostIds,
      status,
      featured,
      seoTitle: (form.get("seoTitle") as string) || null,
      seoDescription: (form.get("seoDescription") as string) || null,
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/ghosts"
          : `/api/admin/ghosts/${initial?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Save failed");
        return;
      }
      toast.success(mode === "create" ? "Ghost created" : "Ghost updated");
      router.push("/admin/ghosts");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label="Name *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (autoSlug) setSlug(createSlug(e.target.value));
          }}
          required
        />
        <div onFocus={() => setAutoSlug(false)}>
          <SlugInput
            nameValue={name}
            slug={slug}
            onSlugChange={setSlug}
            auto={false}
          />
        </div>
      </div>

      <Input
        id="otherNames"
        label="Other names (comma-separated)"
        value={otherNames}
        onChange={(e) => setOtherNames(e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="type"
          name="type"
          label="Type *"
          defaultValue={(initial?.type as string) || "FEMALE_SPIRITS"}
          options={GHOST_TYPES.map((t) => ({
            value: t,
            label: ghostTypeLabel(t),
          }))}
        />
        <Select
          id="dangerLevel"
          name="dangerLevel"
          label="Danger level"
          defaultValue={(initial?.dangerLevel as string) || "UNKNOWN"}
          options={DANGER_LEVELS.map((d) => ({
            value: d,
            label: dangerLabel(d),
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RegionSelector
          regions={regions}
          value={regionId}
          onChange={setRegionId}
        />
        <Input
          id="state"
          name="state"
          label="State"
          defaultValue={(initial?.state as string) || ""}
        />
      </div>

      <Input
        id="habitat"
        name="habitat"
        label="Habitat"
        defaultValue={(initial?.habitat as string) || ""}
      />

      <Textarea
        id="summary"
        name="summary"
        label="Summary"
        rows={3}
        defaultValue={(initial?.summary as string) || ""}
      />
      <Textarea
        id="appearance"
        name="appearance"
        label="Appearance"
        rows={3}
        defaultValue={(initial?.appearance as string) || ""}
      />
      <Textarea
        id="behavior"
        name="behavior"
        label="Behavior"
        rows={3}
        defaultValue={(initial?.behavior as string) || ""}
      />
      <Textarea
        id="origin"
        name="origin"
        label="Origin"
        rows={3}
        defaultValue={(initial?.origin as string) || ""}
      />

      <RichTextEditor
        label="Full description"
        value={fullDescription}
        onChange={setFullDescription}
      />

      <Textarea
        id="culturalNotes"
        name="culturalNotes"
        label="Cultural notes"
        rows={3}
        defaultValue={(initial?.culturalNotes as string) || ""}
      />
      <Textarea
        id="sources"
        name="sources"
        label="Sources"
        rows={2}
        defaultValue={(initial?.sources as string) || ""}
      />

      <ImageUploader value={image} onChange={setImage} label="Primary image" />
      <Textarea
        id="gallery"
        label="Gallery URLs (one per line)"
        rows={3}
        value={gallery}
        onChange={(e) => setGallery(e.target.value)}
      />

      <TagSelector tags={tags} selected={tagIds} onChange={setTagIds} />
      <RelatedGhostSelector
        ghosts={ghosts}
        selected={relatedGhostIds}
        onChange={setRelatedGhostIds}
        excludeId={initial?.id as string}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatusSelect value={status} onChange={setStatus} />
        <label className="flex items-end gap-2 pb-2 text-sm text-cream-muted">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-gold"
          />
          Featured on homepage
        </label>
      </div>

      <Input
        id="seoTitle"
        name="seoTitle"
        label="SEO title"
        defaultValue={(initial?.seoTitle as string) || ""}
      />
      <Textarea
        id="seoDescription"
        name="seoDescription"
        label="SEO description"
        rows={2}
        defaultValue={(initial?.seoDescription as string) || ""}
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : mode === "create" ? "Create ghost" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/ghosts")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

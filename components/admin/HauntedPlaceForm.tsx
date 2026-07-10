"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { SlugInput } from "@/components/admin/SlugInput";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagSelector } from "@/components/admin/TagSelector";
import { RegionSelector } from "@/components/admin/RegionSelector";
import { RelatedGhostSelector } from "@/components/admin/RelatedGhostSelector";
import { createSlug } from "@/lib/utils";
import { toast } from "sonner";

export function HauntedPlaceForm({
  mode,
  initial,
  regions,
  tags,
  ghosts,
}: {
  mode: "create" | "edit";
  initial?: Record<string, unknown>;
  regions: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  ghosts: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState((initial?.name as string) || "");
  const [slug, setSlug] = useState((initial?.slug as string) || "");
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [primaryImage, setPrimaryImage] = useState(
    ((initial?.images as string[]) || [])[0] || ""
  );
  const [extraImages, setExtraImages] = useState(
    ((initial?.images as string[]) || []).slice(1).join("\n")
  );
  const [history, setHistory] = useState((initial?.history as string) || "");
  const [legend, setLegend] = useState((initial?.legend as string) || "");
  const [status, setStatus] = useState((initial?.status as string) || "DRAFT");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [regionId, setRegionId] = useState((initial?.regionId as string) || "");
  const [tagIds, setTagIds] = useState<string[]>(
    ((initial?.tags as { id: string }[]) || []).map((t) => t.id)
  );
  const [relatedGhostIds, setRelatedGhostIds] = useState<string[]>(
    ((initial?.relatedGhosts as { id: string }[]) || []).map((g) => g.id)
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const images = [
      primaryImage,
      ...extraImages
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    ].filter(Boolean);

    const payload = {
      name,
      slug: slug || createSlug(name),
      location: (form.get("location") as string) || null,
      state: (form.get("state") as string) || null,
      regionId: regionId || null,
      history,
      legend,
      reportedActivity: (form.get("reportedActivity") as string) || null,
      warning: (form.get("warning") as string) || null,
      images,
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
          ? "/api/admin/haunted-places"
          : `/api/admin/haunted-places/${initial?.id}`;
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
      toast.success(mode === "create" ? "Place created" : "Place updated");
      router.push("/admin/haunted-places");
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
          <SlugInput nameValue={name} slug={slug} onSlugChange={setSlug} auto={false} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="location"
          name="location"
          label="Location"
          defaultValue={(initial?.location as string) || ""}
        />
        <Input
          id="state"
          name="state"
          label="State"
          defaultValue={(initial?.state as string) || ""}
        />
      </div>
      <RegionSelector regions={regions} value={regionId} onChange={setRegionId} />
      <RichTextEditor label="History" value={history} onChange={setHistory} />
      <RichTextEditor label="Legend" value={legend} onChange={setLegend} />
      <Textarea
        id="reportedActivity"
        name="reportedActivity"
        label="Reported activity"
        rows={3}
        defaultValue={(initial?.reportedActivity as string) || ""}
      />
      <Textarea
        id="warning"
        name="warning"
        label="Warning / disclaimer"
        rows={2}
        defaultValue={(initial?.warning as string) || ""}
      />
      <ImageUploader value={primaryImage} onChange={setPrimaryImage} label="Primary image" />
      <Textarea
        id="extraImages"
        label="Additional image URLs (one per line)"
        rows={3}
        value={extraImages}
        onChange={(e) => setExtraImages(e.target.value)}
      />
      <TagSelector tags={tags} selected={tagIds} onChange={setTagIds} />
      <RelatedGhostSelector
        ghosts={ghosts}
        selected={relatedGhostIds}
        onChange={setRelatedGhostIds}
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
          Featured
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
          {saving ? "Saving…" : mode === "create" ? "Create place" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/haunted-places")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { createSlug } from "@/lib/utils";
import { SlugInput } from "@/components/admin/SlugInput";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagSelector } from "@/components/admin/TagSelector";
import { RegionSelector } from "@/components/admin/RegionSelector";
import { RelatedGhostSelector } from "@/components/admin/RelatedGhostSelector";
import { toast } from "sonner";

export function StoryForm({
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
  const [title, setTitle] = useState((initial?.title as string) || "");
  const [slug, setSlug] = useState((initial?.slug as string) || "");
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [coverImage, setCoverImage] = useState(
    (initial?.coverImage as string) || ""
  );
  const [content, setContent] = useState((initial?.content as string) || "");
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
    const payload = {
      title,
      slug: slug || createSlug(title),
      summary: (form.get("summary") as string) || null,
      content,
      regionId: regionId || null,
      coverImage: coverImage || null,
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
          ? "/api/admin/stories"
          : `/api/admin/stories/${initial?.id}`;
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
      toast.success(mode === "create" ? "Story created" : "Story updated");
      router.push("/admin/stories");
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
          id="title"
          label="Title *"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (autoSlug) setSlug(createSlug(e.target.value));
          }}
          required
        />
        <div onFocus={() => setAutoSlug(false)}>
          <SlugInput nameValue={title} slug={slug} onSlugChange={setSlug} auto={false} />
        </div>
      </div>
      <Textarea
        id="summary"
        name="summary"
        label="Summary"
        rows={3}
        defaultValue={(initial?.summary as string) || ""}
      />
      <RichTextEditor label="Content" value={content} onChange={setContent} />
      <RegionSelector regions={regions} value={regionId} onChange={setRegionId} />
      <ImageUploader value={coverImage} onChange={setCoverImage} label="Cover image" />
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
          {saving ? "Saving…" : mode === "create" ? "Create story" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/stories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

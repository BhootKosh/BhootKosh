"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { toast } from "sonner";

type MediaItem = {
  id: string;
  secureUrl: string;
  url: string;
  alt?: string | null;
  format?: string | null;
  bytes?: number | null;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      setItems(json.items || []);
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Upload failed");
        return;
      }
      toast.success("Uploaded");
      load();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Delete failed");
        return;
      }
      toast.success("Deleted");
      setDeleteId(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <AdminHeader title="Media library" />
      <div className="p-6">
        <div className="mb-6">
          <label className="inline-flex cursor-pointer">
            <span className="rounded-sm border border-saffron bg-saffron px-4 py-2 text-sm text-ink">
              {uploading ? "Uploading…" : "Upload image"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onUpload(e.target.files?.[0])}
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            JPEG, PNG, WebP, GIF · max 5MB · requires Cloudinary env vars
          </p>
        </div>

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState
            title="No media yet"
            description="Upload images once Cloudinary is configured."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((m) => (
              <div
                key={m.id}
                className="overflow-hidden border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0a0a0a]"
              >
                <div className="relative aspect-video">
                  <Image
                    src={m.secureUrl || m.url}
                    alt={m.alt || "Media"}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(m.secureUrl || m.url)}
                  >
                    Copy URL
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteId(m.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </>
  );
}

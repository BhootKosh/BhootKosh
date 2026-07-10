"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { createSlug } from "@/lib/utils";
import { toast } from "sonner";

type Tag = { id: string; name: string; slug: string };

export default function AdminTagsPage() {
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags");
      const json = await res.json();
      setItems(json.items || []);
    } catch {
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, slug: slug || createSlug(name) };
    try {
      const res = await fetch(
        editId ? `/api/admin/tags/${editId}` : "/api/admin/tags",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Save failed");
        return;
      }
      toast.success(editId ? "Updated" : "Created");
      setName("");
      setSlug("");
      setEditId(null);
      load();
    } catch {
      toast.error("Network error");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tags/${deleteId}`, {
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
      <AdminHeader title="Tags" />
      <div className="space-y-8 p-6">
        <form
          onSubmit={save}
          className="grid max-w-xl gap-3 border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0a0a0a] p-5 sm:grid-cols-2"
        >
          <Input
            id="tag-name"
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editId) setSlug(createSlug(e.target.value));
            }}
            required
          />
          <Input
            id="tag-slug"
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(createSlug(e.target.value))}
            required
          />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm">
              {editId ? "Update tag" : "Create tag"}
            </Button>
            {editId && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditId(null);
                  setName("");
                  setSlug("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No tags" />
        ) : (
          <ul className="max-w-xl space-y-2">
            {items.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between border-2 border-ink px-4 py-3 text-sm"
              >
                <div>
                  <span className="text-ink">{t.name}</span>
                  <span className="ml-2 text-xs text-muted">{t.slug}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-gold hover:underline"
                    onClick={() => {
                      setEditId(t.id);
                      setName(t.name);
                      setSlug(t.slug);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-danger-high hover:underline"
                    onClick={() => setDeleteId(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
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

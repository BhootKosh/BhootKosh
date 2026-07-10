"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { createSlug } from "@/lib/utils";
import { toast } from "sonner";

type Region = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  state?: string | null;
  _count?: { ghosts: number; hauntedPlaces: number; stories: number };
};

export default function AdminRegionsPage() {
  const [items, setItems] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/regions");
      const json = await res.json();
      setItems(json.items || []);
    } catch {
      toast.error("Failed to load regions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setEditId(null);
    setName("");
    setSlug("");
    setState("");
    setDescription("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      slug: slug || createSlug(name),
      state: state || null,
      description: description || null,
    };
    try {
      const res = await fetch(
        editId ? `/api/admin/regions/${editId}` : "/api/admin/regions",
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
      resetForm();
      load();
    } catch {
      toast.error("Network error");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/regions/${deleteId}`, {
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
      <AdminHeader title="Regions" />
      <div className="space-y-8 p-6">
        <form
          onSubmit={save}
          className="max-w-xl space-y-3 border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0a0a0a] p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="region-name"
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editId) setSlug(createSlug(e.target.value));
              }}
              required
            />
            <Input
              id="region-slug"
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(createSlug(e.target.value))}
              required
            />
          </div>
          <Input
            id="region-state"
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <Textarea
            id="region-desc"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              {editId ? "Update region" : "Create region"}
            </Button>
            {editId && (
              <Button type="button" size="sm" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No regions" />
        ) : (
          <ul className="max-w-2xl space-y-2">
            {items.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between border-2 border-ink px-4 py-3 text-sm"
              >
                <div>
                  <span className="text-ink">{r.name}</span>
                  {r.state && (
                    <span className="ml-2 text-xs text-muted">{r.state}</span>
                  )}
                  <p className="text-xs text-muted">
                    {r._count?.ghosts || 0} ghosts · {r._count?.hauntedPlaces || 0}{" "}
                    places · {r._count?.stories || 0} stories
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-gold hover:underline"
                    onClick={() => {
                      setEditId(r.id);
                      setName(r.name);
                      setSlug(r.slug);
                      setState(r.state || "");
                      setDescription(r.description || "");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-danger-high hover:underline"
                    onClick={() => setDeleteId(r.id)}
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

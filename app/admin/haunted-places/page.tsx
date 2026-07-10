"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/public/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { toast } from "sonner";

type Row = {
  id: string;
  name: string;
  status: string;
  location?: string | null;
  region?: { name: string } | null;
};

export default function AdminHauntedPlacesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/haunted-places");
      const json = await res.json();
      setItems(json.items || []);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/haunted-places/${deleteId}`, {
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
      <AdminHeader title="Haunted Places" />
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <Link href="/admin/haunted-places/new">
            <Button size="sm">Create place</Button>
          </Link>
        </div>
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No places" />
        ) : (
          <div className="overflow-x-auto border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b-[3px] border-ink bg-gold/30 text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b-2 border-ink/15">
                    <td className="px-4 py-3 text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-muted">
                      {p.location || p.region?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/haunted-places/${p.id}/edit`}
                          className="text-gold hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-danger-high hover:underline"
                          onClick={() => setDeleteId(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

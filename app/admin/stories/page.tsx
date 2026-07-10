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
  title: string;
  status: string;
  region?: { name: string } | null;
};

export default function AdminStoriesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stories");
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
      const res = await fetch(`/api/admin/stories/${deleteId}`, {
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
      <AdminHeader title="Stories" />
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <Link href="/admin/stories/new">
            <Button size="sm">Create story</Button>
          </Link>
        </div>
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No stories" />
        ) : (
          <div className="overflow-x-auto border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b-[3px] border-ink bg-gold/30 text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-b-2 border-ink/15">
                    <td className="px-4 py-3 text-ink">{s.title}</td>
                    <td className="px-4 py-3 text-muted">
                      {s.region?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/stories/${s.id}/edit`}
                          className="text-gold hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-danger-high hover:underline"
                          onClick={() => setDeleteId(s.id)}
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

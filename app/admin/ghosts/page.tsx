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

type GhostRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  type: string;
  region?: { name: string } | null;
};

export default function AdminGhostsPage() {
  const [items, setItems] = useState<GhostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load(search = q) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/ghosts?${params}`);
      const json = await res.json();
      setItems(json.items || []);
    } catch {
      toast.error("Failed to load ghosts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/ghosts/${deleteId}`, {
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
      <AdminHeader title="Ghosts" />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
            className="flex gap-2"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="border-[3px] border-ink bg-white px-3 py-2 text-sm text-ink"
            />
            <Button type="submit" variant="outline" size="sm">
              Search
            </Button>
          </form>
          <Link href="/admin/ghosts/new">
            <Button type="button" size="sm">
              Create ghost
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No ghosts" description="Create your first entry." />
        ) : (
          <div className="overflow-x-auto border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b-[3px] border-ink bg-gold/30 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b-2 border-ink/15 hover:bg-gold/20"
                  >
                    <td className="px-4 py-3 text-ink">{g.name}</td>
                    <td className="px-4 py-3 text-muted">
                      {g.region?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/ghosts/${g.id}/edit`}
                          className="text-gold hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(g.id)}
                          className="text-danger-high hover:underline"
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
        title="Delete ghost?"
      />
    </>
  );
}

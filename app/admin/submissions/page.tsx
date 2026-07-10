"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Submission = {
  id: string;
  name: string;
  regionText: string;
  story: string;
  sourceType: string;
  contactEmail?: string | null;
  status: string;
  createdAt: string;
  convertedGhostId?: string | null;
  convertedStoryId?: string | null;
};

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      const json = await res.json();
      setItems(json.items || []);
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function action(id: string, actionName: string) {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionName }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Action failed");
        return;
      }
      toast.success(
        actionName === "convert-ghost"
          ? "Converted to draft ghost"
          : actionName === "convert-story"
            ? "Converted to draft story"
            : "Updated"
      );
      if (actionName === "convert-ghost" && json.ghost?.id) {
        // stay on page but show link via toast
      }
      load();
    } catch {
      toast.error("Network error");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/submissions/${deleteId}`, {
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
      <AdminHeader title="Submissions" />
      <div className="p-6">
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No submissions" />
        ) : (
          <div className="space-y-4">
            {items.map((s) => (
              <div
                key={s.id}
                className="border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0a0a0a] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl text-ink">{s.name}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {s.regionText} · {s.sourceType} · {formatDate(s.createdAt)} ·{" "}
                      <span className="uppercase">{s.status}</span>
                    </p>
                    {s.contactEmail && (
                      <p className="mt-1 text-xs text-muted">{s.contactEmail}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setExpanded(expanded === s.id ? null : s.id)
                      }
                    >
                      {expanded === s.id ? "Hide" : "View"}
                    </Button>
                    {s.status === "PENDING" && (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => action(s.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => action(s.id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => action(s.id, "convert-ghost")}
                    >
                      → Ghost
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => action(s.id, "convert-story")}
                    >
                      → Story
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteId(s.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {expanded === s.id && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                    {s.story}
                  </p>
                )}
                {s.convertedGhostId && (
                  <p className="mt-2 text-xs text-gold">
                    Converted ghost:{" "}
                    <Link
                      href={`/admin/ghosts/${s.convertedGhostId}/edit`}
                      className="underline"
                    >
                      Edit draft
                    </Link>
                  </p>
                )}
                {s.convertedStoryId && (
                  <p className="mt-2 text-xs text-gold">
                    Converted story:{" "}
                    <Link
                      href={`/admin/stories/${s.convertedStoryId}/edit`}
                      className="underline"
                    >
                      Edit draft
                    </Link>
                  </p>
                )}
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

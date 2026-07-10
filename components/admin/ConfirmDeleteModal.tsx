"use client";

import { Button } from "@/components/ui/Button";

export function ConfirmDeleteModal({
  open,
  title = "Delete this entry?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md border-[3px] border-ink bg-white p-6 shadow-[8px_8px_0_0_#0a0a0a]">
        <span className="brutal-stamp bg-danger-extreme text-white">
          Danger
        </span>
        <h3 className="mt-4 font-display text-xl uppercase text-ink">{title}</h3>
        <p className="mt-2 font-serif text-sm text-muted">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

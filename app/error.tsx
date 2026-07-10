"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="border-[3px] border-ink bg-bg-page px-8 py-10 shadow-[8px_8px_0_0_#0a0a0a]">
        <span className="brutal-stamp bg-danger-extreme text-white">Error</span>
        <h1 className="mt-4 font-display text-3xl uppercase text-ink">
          This page couldn&apos;t load
        </h1>
        <p className="mt-3 max-w-md font-serif text-sm text-muted">
          A server error occurred. Try again in a moment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="brutal-btn brutal-btn-primary"
          >
            Reload
          </button>
          <Link href="/" className="brutal-btn brutal-btn-ghost">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

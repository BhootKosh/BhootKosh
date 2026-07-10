"use client";

import Link from "next/link";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="border-[3px] border-ink bg-white px-8 py-10 shadow-[6px_6px_0_0_#0a0a0a]">
        <span className="brutal-stamp bg-saffron text-white">Archive</span>
        <h1 className="mt-4 font-display text-2xl uppercase text-ink sm:text-3xl">
          Entry unavailable
        </h1>
        <p className="mt-3 max-w-md font-serif text-sm text-muted">
          We couldn&apos;t load this page. The archive may be reconnecting — try
          again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="brutal-btn brutal-btn-primary"
          >
            Try again
          </button>
          <Link href="/" className="brutal-btn brutal-btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="border-[3px] border-ink bg-bg-page px-8 py-10 shadow-[8px_8px_0_0_#0a0a0a] sm:px-12">
        <span className="brutal-stamp bg-saffron text-white">404</span>
        <h1 className="mt-5 font-display text-4xl uppercase text-ink sm:text-5xl">
          Entry not found
        </h1>
        <p className="mx-auto mt-4 max-w-md font-serif text-sm text-muted">
          This page is missing from the archive—or it may still be a draft.
        </p>
        <Link href="/" className="brutal-btn brutal-btn-primary mt-8">
          Return home
        </Link>
      </div>
    </div>
  );
}

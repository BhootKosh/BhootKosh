import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const items: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - (pages[i - 1] as number) > 1) items.push("…");
    items.push(p);
  });

  const linkClass =
    "min-h-9 min-w-9 border-[3px] border-ink px-3 py-1.5 text-xs font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a] transition hover:-translate-x-0.5 hover:-translate-y-0.5";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          linkClass,
          "bg-white text-ink",
          page <= 1 && "pointer-events-none opacity-40"
        )}
      >
        Prev
      </Link>
      {items.map((item, i) =>
        item === "…" ? (
          <span key={`e-${i}`} className="px-2 font-bold text-ink">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            className={cn(
              linkClass,
              item === page ? "bg-ink text-gold" : "bg-white text-ink"
            )}
          >
            {item}
          </Link>
        )
      )}
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          linkClass,
          "bg-white text-ink",
          page >= totalPages && "pointer-events-none opacity-40"
        )}
      >
        Next
      </Link>
    </nav>
  );
}

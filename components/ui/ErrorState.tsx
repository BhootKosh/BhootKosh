import { cn } from "@/lib/utils";
import Link from "next/link";

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this page. Please try again.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-[3px] border-ink bg-white px-6 py-14 text-center shadow-[4px_4px_0_0_#0a0a0a]",
        className
      )}
    >
      <span className="brutal-stamp bg-danger-extreme text-white">Error</span>
      <h3 className="mt-4 font-display text-xl uppercase text-ink">{title}</h3>
      <p className="mt-2 max-w-md font-serif text-sm text-muted">{description}</p>
      <Link href="/" className="brutal-btn brutal-btn-primary mt-6">
        Return home
      </Link>
    </div>
  );
}

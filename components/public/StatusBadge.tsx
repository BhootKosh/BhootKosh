import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const published = status === "PUBLISHED";
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-[2px_2px_0_0_#0a0a0a]",
        published ? "bg-danger-low text-white" : "bg-white text-ink",
        className
      )}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

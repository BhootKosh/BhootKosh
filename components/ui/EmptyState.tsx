import { cn } from "@/lib/utils";

export function EmptyState({
  title = "Nothing found",
  description = "Try adjusting your search or filters.",
  className,
  action,
}: {
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-[3px] border-ink bg-white px-6 py-14 text-center shadow-[4px_4px_0_0_#0a0a0a]",
        className
      )}
    >
      <div className="mb-3 border-2 border-ink bg-gold px-2 py-1 font-display text-xs uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]">
        Empty
      </div>
      <h3 className="font-display text-xl uppercase text-ink">{title}</h3>
      <p className="mt-2 max-w-md font-serif text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

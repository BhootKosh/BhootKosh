import { cn } from "@/lib/utils";

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 border-[3px] border-ink bg-white px-6 py-14 text-center shadow-[4px_4px_0_0_#0a0a0a]",
        className
      )}
    >
      <div className="h-8 w-8 animate-spin border-[3px] border-ink border-t-saffron" />
      <p className="text-xs font-bold uppercase tracking-wide text-ink">
        {label}
      </p>
    </div>
  );
}

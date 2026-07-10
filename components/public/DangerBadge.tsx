import { cn, dangerLabel } from "@/lib/utils";

const styles: Record<string, string> = {
  LOW: "bg-danger-low text-white",
  MEDIUM: "bg-gold text-ink",
  HIGH: "bg-saffron text-white",
  EXTREME: "bg-danger-extreme text-white",
  UNKNOWN: "bg-white text-ink",
};

export function DangerBadge({
  level,
  className,
}: {
  level: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-[2px_2px_0_0_#0a0a0a]",
        styles[level] || styles.UNKNOWN,
        className
      )}
    >
      {dangerLabel(level)}
    </span>
  );
}

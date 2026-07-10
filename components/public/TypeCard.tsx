import Link from "next/link";
import { ghostTypeLabel, ghostTypeSlug } from "@/lib/utils";

const accents = [
  "bg-gold",
  "bg-saffron",
  "bg-accent-cyan",
  "bg-accent-pink",
  "bg-white",
];

export function TypeCard({
  type,
  count = 0,
  index = 0,
}: {
  type: string;
  count?: number;
  index?: number;
}) {
  const accent = accents[index % accents.length];

  return (
    <Link
      href={`/types/${ghostTypeSlug(type)}`}
      className="brutal-card group block overflow-hidden bg-white p-0"
    >
      <div className={`h-3 border-b-[3px] border-ink ${accent}`} />
      <div className="p-3 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          Type
        </p>
        <h3 className="mt-1 font-display text-base uppercase leading-tight text-ink group-hover:text-saffron sm:text-lg">
          {ghostTypeLabel(type)}
        </h3>
        <p className="mt-2 text-xs font-bold uppercase text-ink">
          {count} spirit{count === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}

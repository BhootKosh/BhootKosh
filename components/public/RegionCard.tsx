import Link from "next/link";

export function RegionCard({
  region,
}: {
  region: {
    name: string;
    slug: string;
    description?: string | null;
    state?: string | null;
    _count?: { ghosts: number; hauntedPlaces: number; stories: number };
  };
}) {
  const total =
    (region._count?.ghosts || 0) +
    (region._count?.hauntedPlaces || 0) +
    (region._count?.stories || 0);

  return (
    <Link
      href={`/regions/${region.slug}`}
      className="brutal-card group block overflow-hidden bg-white p-0"
    >
      <div className="h-3 border-b-[3px] border-ink bg-saffron" />
      <div className="p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          Region
        </p>
        <h3 className="mt-1 font-display text-xl uppercase leading-tight text-ink group-hover:text-saffron">
          {region.name}
        </h3>
        {region.state && (
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">
            {region.state}
          </p>
        )}
        {region.description && (
          <p className="mt-3 line-clamp-2 font-serif text-sm leading-relaxed text-ink/85">
            {region.description}
          </p>
        )}
        <span className="mt-4 inline-flex border-2 border-ink bg-gold px-2 py-1 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]">
          {total} entr{total === 1 ? "y" : "ies"} →
        </span>
      </div>
    </Link>
  );
}

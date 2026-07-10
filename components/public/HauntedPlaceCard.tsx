import Link from "next/link";
import Image from "next/image";
import { truncate } from "@/lib/utils";

export type HauntedPlaceCardData = {
  id: string;
  name: string;
  slug: string;
  location?: string | null;
  state?: string | null;
  legend?: string | null;
  images?: string[];
  region?: { name: string } | null;
};

export function HauntedPlaceCard({
  place,
  priority = false,
}: {
  place: HauntedPlaceCardData;
  priority?: boolean;
}) {
  const image = place.images?.[0];
  const plainLegend = place.legend?.replace(/<[^>]+>/g, "") || "";

  return (
    <Link
      href={`/haunted-places/${place.slug}`}
      className="brutal-card group flex h-full flex-col overflow-hidden bg-white active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-ink bg-ink">
        {image ? (
          <Image
            src={image}
            alt={place.name}
            fill
            priority={priority}
            className="object-cover transition duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-4xl text-gold">▣</span>
          </div>
        )}
        <span className="absolute left-2 top-2 border-2 border-ink bg-accent-pink px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]">
          Place
        </span>
      </div>
      <div className="flex flex-1 flex-col bg-bg-card p-3 sm:p-4">
        <h3 className="font-display text-lg uppercase leading-tight text-ink group-hover:text-saffron">
          {place.name}
        </h3>
        <p className="mt-1 text-[11px] font-bold uppercase text-muted">
          {[place.location, place.state || place.region?.name]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {plainLegend && (
          <p className="mt-2 flex-1 font-serif text-sm leading-snug text-ink/85">
            {truncate(plainLegend, 100)}
          </p>
        )}
        <span className="mt-3 inline-flex w-fit border-2 border-ink bg-accent-cyan px-2 py-1 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]">
          View place →
        </span>
      </div>
    </Link>
  );
}

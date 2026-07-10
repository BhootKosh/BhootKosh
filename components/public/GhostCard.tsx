import Link from "next/link";
import Image from "next/image";
import { DangerBadge } from "./DangerBadge";
import { ghostTypeLabel, truncate } from "@/lib/utils";

export type GhostCardData = {
  id: string;
  name: string;
  slug: string;
  type: string;
  dangerLevel: string;
  summary?: string | null;
  image?: string | null;
  state?: string | null;
  region?: { name: string; slug: string } | null;
};

export function GhostCard({
  ghost,
  priority = false,
}: {
  ghost: GhostCardData;
  /** Set true for above-the-fold LCP candidates (first row / hero cards). */
  priority?: boolean;
}) {
  return (
    <Link
      href={`/ghosts/${ghost.slug}`}
      className="brutal-card group flex h-full flex-col overflow-hidden bg-white active:scale-[0.99]"
    >
      <div className="relative aspect-[16/11] overflow-hidden border-b-[3px] border-ink bg-ink sm:aspect-[4/3]">
        {ghost.image ? (
          <Image
            src={ghost.image}
            alt={ghost.name}
            fill
            priority={priority}
            className="object-cover transition duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-4xl text-gold">◈</span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <DangerBadge level={ghost.dangerLevel} />
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="border-2 border-ink bg-accent-cyan px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_#0a0a0a]">
            {ghostTypeLabel(ghost.type)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-bg-card p-3.5 sm:p-4">
        <h3 className="font-display text-base uppercase leading-tight text-ink transition group-hover:text-saffron sm:text-xl">
          {ghost.name}
        </h3>
        {(ghost.region || ghost.state) && (
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">
            {[ghost.region?.name, ghost.state].filter(Boolean).join(" · ")}
          </p>
        )}
        {ghost.summary && (
          <p className="mt-2 line-clamp-2 flex-1 font-serif text-sm leading-snug text-ink/85 sm:line-clamp-3">
            {truncate(ghost.summary, 100)}
          </p>
        )}
        <span className="mt-3 inline-flex w-fit border-2 border-ink bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_#0a0a0a]">
          View entry →
        </span>
      </div>
    </Link>
  );
}

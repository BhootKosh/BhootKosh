import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { GhostCard } from "@/components/public/GhostCard";
import { SearchBar } from "@/components/public/SearchBar";
import { FilterSidebar } from "@/components/public/FilterSidebar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  getPagination,
  getTotalPages,
  DANGER_LEVELS,
  GHOST_TYPES,
} from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { DangerLevel, GhostType, Prisma } from "@prisma/client";

export const metadata = buildMetadata({
  title: "Ghost Encyclopedia",
  description:
    "Browse the illustrated encyclopedia of Indian ghosts, spirits, and demons.",
  path: "/ghosts",
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function GhostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const type = typeof sp.type === "string" ? sp.type : "";
  const region = typeof sp.region === "string" ? sp.region : "";
  const danger = typeof sp.danger === "string" ? sp.danger : "";
  const habitat = typeof sp.habitat === "string" ? sp.habitat : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "newest";
  const page = Number(typeof sp.page === "string" ? sp.page : "1") || 1;
  const { skip, take, page: currentPage } = getPagination(page, 12);

  const where: Prisma.GhostWhereInput = { status: "PUBLISHED" };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { otherNames: { has: q } },
      { summary: { contains: q, mode: "insensitive" } },
    ];
  }
  if (type && (GHOST_TYPES as readonly string[]).includes(type)) {
    where.type = type as GhostType;
  }
  if (danger && (DANGER_LEVELS as readonly string[]).includes(danger)) {
    where.dangerLevel = danger as DangerLevel;
  }
  if (habitat) {
    where.habitat = { contains: habitat, mode: "insensitive" };
  }
  if (region) {
    where.region = { slug: region };
  }

  let orderBy: Prisma.GhostOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "name") orderBy = { name: "asc" };
  if (sort === "popularity") orderBy = { viewCount: "desc" };

  let ghosts: Awaited<ReturnType<typeof prisma.ghost.findMany>> = [];
  let total = 0;
  let regions: { slug: string; name: string }[] = [];

  try {
    const [g, t, r] = await Promise.all([
      prisma.ghost.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { region: { select: { name: true, slug: true } } },
      }),
      prisma.ghost.count({ where }),
      prisma.region.findMany({
        select: { slug: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
    ghosts = g;
    total = t;
    regions = r;
  } catch {
    /* empty */
  }

  return (
    <div className="fade-in px-3 py-5 sm:px-6 sm:py-8 lg:px-10">
      <div className="mb-5 border-b-[3px] border-ink pb-4 sm:mb-6">
        <span className="chapter-label">Encyclopedia</span>
        <h1 className="mt-2 font-display text-3xl uppercase leading-[0.95] text-ink sm:text-5xl">
          Ghost Encyclopedia
        </h1>
        <p className="mt-2 max-w-2xl font-serif text-sm text-muted">
          Search and filter Indian spirits, demons, and mythological beings.
        </p>
        <div className="mt-4 sm:mt-5">
          <Suspense fallback={<LoadingState label="Loading search…" />}>
            <SearchBar placeholder="Search by name…" />
          </Suspense>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[280px_1fr] lg:gap-8 xl:grid-cols-[300px_1fr]">
        <Suspense fallback={null}>
          <FilterSidebar regions={regions} />
        </Suspense>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink">
              {total} result{total === 1 ? "" : "s"}
            </p>
            {(type || region || danger || habitat || sort !== "newest") && (
              <p className="text-[10px] font-bold uppercase tracking-wide text-saffron">
                Filters active
              </p>
            )}
          </div>
          {ghosts.length === 0 ? (
            <EmptyState title="No spirits found" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {ghosts.map((g, i) => (
                <GhostCard key={g.id} ghost={g} priority={i < 3} />
              ))}
            </div>
          )}
          <Pagination
            page={currentPage}
            totalPages={getTotalPages(total, 12)}
            basePath="/ghosts"
            searchParams={{
              q: q || undefined,
              type: type || undefined,
              region: region || undefined,
              danger: danger || undefined,
              habitat: habitat || undefined,
              sort: sort !== "newest" ? sort : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}

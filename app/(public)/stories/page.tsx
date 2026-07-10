import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StoryCard } from "@/components/public/StoryCard";
import { SearchBar } from "@/components/public/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPagination, getTotalPages } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Prisma } from "@prisma/client";

export const metadata = buildMetadata({
  title: "Folklore Stories",
  description:
    "Read curated Indian folklore stories and narrative accounts from the BhootKosh archive.",
  path: "/stories",
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const region = typeof sp.region === "string" ? sp.region : "";
  const page = Number(typeof sp.page === "string" ? sp.page : "1") || 1;
  const { skip, take, page: currentPage } = getPagination(page, 9);

  const where: Prisma.StoryWhereInput = { status: "PUBLISHED" };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
    ];
  }
  if (region) where.region = { slug: region };

  let stories: Awaited<ReturnType<typeof prisma.story.findMany>> = [];
  let total = 0;
  let regions: { slug: string; name: string }[] = [];

  try {
    const [s, t, r] = await Promise.all([
      prisma.story.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { region: { select: { name: true } } },
      }),
      prisma.story.count({ where }),
      prisma.region.findMany({
        select: { slug: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
    stories = s;
    total = t;
    regions = r;
  } catch {
    /* empty */
  }

  const chip =
    "border-2 border-ink px-3 py-1 text-xs font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a]";

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <span className="chapter-label">Narratives</span>
      <h1 className="mt-2 font-display text-3xl uppercase text-ink sm:text-5xl">
        Folklore Stories
      </h1>
      <p className="mt-2 max-w-2xl font-serif text-sm text-muted">
        Narrative accounts drawn from oral tradition and local legend.
      </p>
      <div className="mt-5">
        <Suspense fallback={null}>
          <SearchBar placeholder="Search stories…" />
        </Suspense>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/stories"
          className={`${chip} ${!region ? "bg-ink text-gold" : "bg-white text-ink hover:bg-gold"}`}
        >
          All regions
        </Link>
        {regions.map((r) => (
          <Link
            key={r.slug}
            href={`/stories?region=${r.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`${chip} ${
              region === r.slug
                ? "bg-ink text-gold"
                : "bg-white text-ink hover:bg-gold"
            }`}
          >
            {r.name}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-ink">
        {total} stor{total === 1 ? "y" : "ies"}
      </p>

      {stories.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No stories found" />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      )}
      <Pagination
        page={currentPage}
        totalPages={getTotalPages(total, 9)}
        basePath="/stories"
        searchParams={{
          q: q || undefined,
          region: region || undefined,
        }}
      />
    </div>
  );
}

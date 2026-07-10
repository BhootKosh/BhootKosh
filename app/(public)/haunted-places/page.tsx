import { Suspense } from "react";
import Link from "next/link";
import { HauntedPlaceCard } from "@/components/public/HauntedPlaceCard";
import { SearchBar } from "@/components/public/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTotalPages } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { getPlaceList } from "@/lib/data";

export const metadata = buildMetadata({
  title: "Haunted Places of India",
  description:
    "Explore legendary haunted forts, villages, beaches, and ruins across India.",
  path: "/haunted-places",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HauntedPlacesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const region = typeof sp.region === "string" ? sp.region : "";
  const page = Number(typeof sp.page === "string" ? sp.page : "1") || 1;

  let places: Awaited<ReturnType<typeof getPlaceList>>["places"] = [];
  let total = 0;
  let regions: { slug: string; name: string }[] = [];
  let currentPage = page;

  try {
    const data = await getPlaceList({
      q: q || undefined,
      region: region || undefined,
      page,
      pageSize: 12,
    });
    places = data.places;
    total = data.total;
    regions = data.regions;
    currentPage = data.page;
  } catch {
    /* empty */
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <span className="chapter-label">Locations</span>
      <h1 className="mt-2 font-display text-3xl uppercase text-ink sm:text-5xl">
        Haunted Places
      </h1>
      <p className="mt-2 max-w-2xl font-serif text-sm text-muted">
        Forts, abandoned villages, beaches, and estates steeped in legend.
      </p>
      <div className="mt-5">
        <Suspense fallback={null}>
          <SearchBar placeholder="Search places…" />
        </Suspense>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/haunted-places"
          className={`border-2 border-ink px-3 py-1 text-xs font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a] ${
            !region ? "bg-ink text-gold" : "bg-white text-ink hover:bg-gold"
          }`}
        >
          All
        </Link>
        {regions.map((r) => (
          <Link
            key={r.slug}
            href={`/haunted-places?region=${r.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`border-2 border-ink px-3 py-1 text-xs font-bold uppercase shadow-[2px_2px_0_0_#0a0a0a] ${
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
        {total} place{total === 1 ? "" : "s"}
      </p>

      {places.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No places found" />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p, i) => (
            <HauntedPlaceCard key={p.id} place={p} priority={i < 2} />
          ))}
        </div>
      )}
      <Pagination
        page={currentPage}
        totalPages={getTotalPages(total, 12)}
        basePath="/haunted-places"
        searchParams={{
          q: q || undefined,
          region: region || undefined,
        }}
      />
    </div>
  );
}

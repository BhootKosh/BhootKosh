import { IndiaMapLazy } from "@/components/public/IndiaMapLazy";
import { RegionCard } from "@/components/public/RegionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { buildMetadata } from "@/lib/seo";
import { getCachedRegionsForMap } from "@/lib/data";

export const metadata = buildMetadata({
  title: "Regions of Indian Folklore",
  description:
    "Explore Indian ghosts and folklore by state. Use the map to discover spirits, haunted places, and stories from each region.",
  path: "/regions",
});

export const revalidate = 120;

export default async function RegionsPage() {
  let regions: Awaited<ReturnType<typeof getCachedRegionsForMap>> = [];
  try {
    regions = await getCachedRegionsForMap();
  } catch {
    /* empty */
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <span className="chapter-label">Geography</span>
      <h1 className="mt-2 font-display text-3xl uppercase text-ink sm:text-5xl">
        Regions of India
      </h1>
      <p className="mt-2 max-w-2xl font-serif text-sm text-muted">
        Folklore is rooted in landscape. Select a state to explore local
        spirits, places, and stories.
      </p>
      <div className="mt-8 border-[3px] border-ink bg-ink p-2 shadow-[6px_6px_0_0_#0a0a0a] sm:p-3">
        <IndiaMapLazy regions={regions} variant="full" />
      </div>
      <section className="mt-10 border-t-[3px] border-ink pt-8">
        <h2 className="font-display text-2xl uppercase text-ink sm:text-3xl">
          All archive regions
        </h2>
        {regions.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No regions yet" />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((r) => (
              <RegionCard key={r.id} region={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

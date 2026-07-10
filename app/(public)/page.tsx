import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/public/HeroSection";
import { GhostCard } from "@/components/public/GhostCard";
import { HauntedPlaceCard } from "@/components/public/HauntedPlaceCard";
import { StoryCard } from "@/components/public/StoryCard";
import { TypeCard } from "@/components/public/TypeCard";
import { SectionHeader } from "@/components/public/SectionHeader";
import { IndiaMap } from "@/components/public/IndiaMap";
import { GHOST_TYPES } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "BhootKosh | Indian Folklore Archive",
  description:
    "The illustrated archive of Indian ghosts, spirits, demons, haunted places, and folklore.",
  path: "/",
});

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredGhosts: Awaited<ReturnType<typeof getFeaturedGhosts>> = [];
  let places: Awaited<ReturnType<typeof getPlaces>> = [];
  let stories: Awaited<ReturnType<typeof getStories>> = [];
  let regions: Awaited<ReturnType<typeof getRegions>> = [];
  let typeCounts: Record<string, number> = {};

  try {
    [featuredGhosts, places, stories, regions, typeCounts] = await Promise.all([
      getFeaturedGhosts(),
      getPlaces(),
      getStories(),
      getRegions(),
      getTypeCounts(),
    ]);
  } catch {
    /* empty */
  }

  return (
    <div className="fade-in">
      <HeroSection />

      <div className="space-y-0">
        <section className="border-b-[3px] border-ink px-3 py-7 sm:px-6 sm:py-10 lg:px-10">
          <SectionHeader
            chapter="Section 01"
            title="Featured Spirits"
            href="/ghosts"
            linkLabel="Full encyclopedia"
            subtitle="Notable entries from across the subcontinent."
          />
          {featuredGhosts.length === 0 ? (
            <div className="border-[3px] border-ink bg-white p-6 text-center shadow-[4px_4px_0_0_#0a0a0a] sm:p-8">
              <p className="font-bold uppercase text-ink">
                No featured spirits yet. Seed the database to populate content.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {featuredGhosts.map((g, i) => (
                <GhostCard key={g.id} ghost={g} priority={i < 3} />
              ))}
            </div>
          )}
        </section>

        <section className="border-b-[3px] border-ink bg-white/50 px-3 py-7 sm:px-6 sm:py-10 lg:px-10">
          <SectionHeader
            chapter="Section 02"
            title="Spirit Types"
            href="/types"
            linkLabel="All types"
            subtitle="Browse by tradition and lore category."
          />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
            {GHOST_TYPES.map((t, i) => (
              <TypeCard key={t} type={t} count={typeCounts[t] || 0} index={i} />
            ))}
          </div>
        </section>

        <section className="border-b-[3px] border-ink px-3 py-7 sm:px-6 sm:py-10 lg:px-10">
          <SectionHeader
            chapter="Section 03"
            title="Map of India"
            href="/regions"
            linkLabel="Full map"
            subtitle="Select a state to explore local folklore."
          />
          <div className="border-[3px] border-ink bg-ink p-1.5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-3">
            <IndiaMap regions={regions} variant="compact" />
          </div>
        </section>

        <section className="border-b-[3px] border-ink bg-gold/25 px-3 py-7 sm:px-6 sm:py-10 lg:px-10">
          <SectionHeader
            chapter="Section 04"
            title="Haunted Places"
            href="/haunted-places"
            linkLabel="All places"
            subtitle="Forts, villages, beaches, and ruins of legend."
          />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {places.map((p, i) => (
              <HauntedPlaceCard key={p.id} place={p} priority={i < 2} />
            ))}
          </div>
        </section>

        <section className="border-b-[3px] border-ink px-3 py-7 sm:px-6 sm:py-10 lg:px-10">
          <SectionHeader
            chapter="Section 05"
            title="Folklore Stories"
            href="/stories"
            linkLabel="All stories"
            subtitle="Narrative accounts from the archive."
          />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-ink px-4 py-10 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 halftone opacity-30" />
          <div className="relative">
            <span className="brutal-stamp bg-accent-pink text-ink">
              Contribute
            </span>
            <h2 className="mt-5 font-display text-3xl uppercase text-gold sm:text-5xl">
              Know a local legend?
            </h2>
            <p className="mx-auto mt-4 max-w-lg border-[3px] border-gold bg-bg-page p-4 font-serif text-sm text-ink shadow-[4px_4px_0_0_#f4c430] sm:text-base">
              Submit a ghost story or regional spirit for editorial review.
              Nothing is published without careful consideration.
            </p>
            <Link href="/submit" className="brutal-btn brutal-btn-primary mt-8">
              Submit a Legend
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

async function getFeaturedGhosts() {
  return prisma.ghost.findMany({
    where: { status: "PUBLISHED", featured: true },
    take: 6,
    orderBy: { updatedAt: "desc" },
    include: { region: { select: { name: true, slug: true } } },
  });
}

async function getPlaces() {
  return prisma.hauntedPlace.findMany({
    where: { status: "PUBLISHED" },
    take: 3,
    orderBy: { updatedAt: "desc" },
    include: { region: { select: { name: true } } },
  });
}

async function getStories() {
  return prisma.story.findMany({
    where: { status: "PUBLISHED" },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { region: { select: { name: true } } },
  });
}

async function getRegions() {
  return prisma.region.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { ghosts: true, hauntedPlaces: true, stories: true },
      },
      ghosts: {
        where: { status: "PUBLISHED" },
        take: 4,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          dangerLevel: true,
        },
      },
    },
  });
}

async function getTypeCounts() {
  const groups = await prisma.ghost.groupBy({
    by: ["type"],
    where: { status: "PUBLISHED" },
    _count: true,
  });
  return Object.fromEntries(groups.map((g) => [g.type, g._count]));
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GhostCard } from "@/components/public/GhostCard";
import { HauntedPlaceCard } from "@/components/public/HauntedPlaceCard";
import { StoryCard } from "@/components/public/StoryCard";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const region = await prisma.region.findUnique({ where: { slug } });
    if (!region) return { title: "Region" };
    return buildMetadata({
      title: `${region.name} Folklore & Legends`,
      description:
        region.description ||
        `Ghosts, haunted places, and folklore stories from ${region.name}.`,
      path: `/regions/${region.slug}`,
      image: region.image,
    });
  } catch {
    return { title: "Region" };
  }
}

export default async function RegionDetailPage({ params }: Props) {
  const { slug } = await params;
  let region;
  try {
    region = await prisma.region.findUnique({
      where: { slug },
      include: {
        ghosts: {
          where: { status: "PUBLISHED" },
          include: { region: { select: { name: true, slug: true } } },
        },
        hauntedPlaces: {
          where: { status: { equals: "PUBLISHED" } },
          include: { region: { select: { name: true } } },
        },
        stories: {
          where: { status: "PUBLISHED" },
          include: { region: { select: { name: true } } },
        },
      },
    });
  } catch {
    notFound();
  }
  if (!region) notFound();

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mb-5 flex flex-wrap items-center gap-2 border-[3px] border-ink bg-white px-3 py-2 text-xs font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
        <Link href="/regions" className="hover:text-saffron">
          Regions
        </Link>
        <span className="text-muted">/</span>
        <span>{region.name}</span>
      </div>

      <div className="border-[3px] border-ink bg-saffron p-5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-6">
        <span className="brutal-stamp bg-gold text-ink">Region</span>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-ink sm:text-5xl">
          {region.name}
        </h1>
        {region.state && (
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/80">
            {region.state}
          </p>
        )}
        {region.description && (
          <p className="mt-4 max-w-3xl border-l-4 border-ink bg-bg-page p-3 font-serif text-sm leading-relaxed text-ink shadow-[3px_3px_0_0_#0a0a0a] sm:text-base">
            {region.description}
          </p>
        )}
      </div>

      <section className="mt-10">
        <h2 className="mb-5 font-display text-2xl uppercase text-ink sm:text-3xl">
          Ghosts
        </h2>
        {region.ghosts.length === 0 ? (
          <p className="border-[3px] border-ink bg-white p-4 text-sm font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
            No published ghosts for this region.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {region.ghosts.map((g) => (
              <GhostCard key={g.id} ghost={g} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-5 font-display text-2xl uppercase text-ink sm:text-3xl">
          Haunted Places
        </h2>
        {region.hauntedPlaces.length === 0 ? (
          <p className="border-[3px] border-ink bg-white p-4 text-sm font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
            No haunted places listed yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {region.hauntedPlaces.map((p) => (
              <HauntedPlaceCard key={p.id} place={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-5 font-display text-2xl uppercase text-ink sm:text-3xl">
          Stories
        </h2>
        {region.stories.length === 0 ? (
          <p className="border-[3px] border-ink bg-white p-4 text-sm font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
            No stories for this region yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {region.stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

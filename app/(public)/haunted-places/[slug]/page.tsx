import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GhostCard } from "@/components/public/GhostCard";
import { StoryCard } from "@/components/public/StoryCard";
import { ShareButtons } from "@/components/public/ShareButtons";
import { ensureHtml } from "@/lib/sanitize";
import { buildMetadata, getSiteUrl, placeJsonLd, plainText } from "@/lib/seo";
import {
  getCachedPlaceBySlug,
  getCachedPlaceMeta,
  getPublishedPlaceSlugs,
} from "@/lib/data";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const places = await getPublishedPlaceSlugs();
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const place = await getCachedPlaceMeta(slug);
    if (!place) return { title: "Not found" };
    return buildMetadata({
      title: place.seoTitle || `${place.name} | Haunted Place India`,
      description:
        place.seoDescription ||
        plainText(
          place.legend ||
            `History, legend, and folklore of ${place.name}, India.`,
          180
        ),
      path: `/haunted-places/${place.slug}`,
      image: place.images?.[0],
      type: "article",
    });
  } catch {
    return { title: "Haunted Place" };
  }
}

export default async function HauntedPlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  let place;
  try {
    place = await getCachedPlaceBySlug(slug);
  } catch (err) {
    console.error("[haunted-place detail]", slug, err);
    throw err;
  }
  if (!place) notFound();

  const url = `${getSiteUrl()}/haunted-places/${place.slug}`;
  const images = place.images ?? [];
  const relatedGhosts = (place.relatedGhosts ?? [])
    .filter((g) => g.status === "PUBLISHED")
    .slice(0, 4);
  const relatedStories = (place.relatedStories ?? [])
    .filter((s) => s.status === "PUBLISHED")
    .slice(0, 3);

  return (
    <article className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            placeJsonLd({
              name: place.name,
              legend: place.legend,
              location: place.location,
              state: place.state,
              image: images[0],
              slug: place.slug,
            })
          ),
        }}
      />
      <div className="mb-5 flex flex-wrap items-center gap-2 border-[3px] border-ink bg-white px-3 py-2 text-xs font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
        <Link href="/haunted-places" className="hover:text-saffron">
          Haunted Places
        </Link>
        <span className="text-muted">/</span>
        <span>{place.name}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-[3px] border-ink bg-accent-pink p-5 shadow-[6px_6px_0_0_#0a0a0a]">
          <span className="border-2 border-ink bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]">
            Location
          </span>
          <h1 className="mt-3 font-display text-4xl uppercase text-ink sm:text-5xl">
            {place.name}
          </h1>
          <p className="mt-2 text-sm font-bold uppercase text-ink/80">
            {[place.location, place.state, place.region?.name]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {place.warning && (
            <div className="mt-5 border-[3px] border-ink bg-gold p-3 text-sm text-ink shadow-[3px_3px_0_0_#0a0a0a]">
              <p className="text-[10px] font-bold uppercase">Disclaimer</p>
              <p className="mt-1 font-serif leading-relaxed">{place.warning}</p>
            </div>
          )}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden border-[3px] border-ink bg-ink shadow-[6px_6px_0_0_#0a0a0a]">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={place.name}
              fill
              className="object-cover"
              priority
              quality={80}
              sizes="50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-6xl text-gold">
              ▣
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.slice(1).map((img, i) => (
            <div
              key={i}
              className="relative aspect-video overflow-hidden border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a]"
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                quality={70}
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {[
          { title: "History", body: place.history },
          { title: "Legend", body: place.legend },
          { title: "Reported Activity", body: place.reportedActivity },
        ].map(
          (s) =>
            s.body && (
              <section
                key={s.title}
                className="border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]"
              >
                <h2 className="font-display text-xl uppercase text-ink">
                  {s.title}
                </h2>
                <div
                  className="prose-archive mt-3"
                  dangerouslySetInnerHTML={{ __html: ensureHtml(s.body) }}
                />
              </section>
            )
        )}
      </div>

      <div className="mt-6 border-[3px] border-ink bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]">
        <ShareButtons title={place.name} url={url} />
      </div>

      {relatedGhosts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl uppercase text-ink">
            Related Ghosts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedGhosts.map((g) => (
              <GhostCard key={g.id} ghost={g} />
            ))}
          </div>
        </section>
      )}

      {relatedStories.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-2xl uppercase text-ink">
            Related Stories
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedStories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

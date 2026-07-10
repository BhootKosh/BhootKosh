import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GhostCard } from "@/components/public/GhostCard";
import { ShareButtons } from "@/components/public/ShareButtons";
import { ensureHtml } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";
import { buildMetadata, getSiteUrl, plainText, storyJsonLd } from "@/lib/seo";
import {
  getCachedStoryBySlug,
  getCachedStoryMeta,
  getPublishedStorySlugs,
} from "@/lib/data";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const stories = await getPublishedStorySlugs();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const story = await getCachedStoryMeta(slug);
    if (!story) return { title: "Not found" };
    return buildMetadata({
      title: story.seoTitle || story.title,
      description:
        story.seoDescription ||
        plainText(story.summary || `Read ${story.title} on BhootKosh.`, 180),
      path: `/stories/${story.slug}`,
      image: story.coverImage,
      type: "article",
    });
  } catch {
    return { title: "Story" };
  }
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  let story;
  try {
    story = await getCachedStoryBySlug(slug);
  } catch (err) {
    console.error("[story detail]", slug, err);
    throw err;
  }
  if (!story) notFound();

  const relatedGhosts = (story.relatedGhosts ?? [])
    .filter((g) => g.status === "PUBLISHED")
    .slice(0, 4);

  const url = `${getSiteUrl()}/stories/${story.slug}`;

  return (
    <article className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            storyJsonLd({
              title: story.title,
              summary: story.summary,
              coverImage: story.coverImage,
              slug: story.slug,
              createdAt: story.createdAt,
            })
          ),
        }}
      />
      <div className="mb-5 flex flex-wrap items-center gap-2 border-[3px] border-ink bg-white px-3 py-2 text-xs font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
        <Link href="/stories" className="hover:text-saffron">
          Stories
        </Link>
        <span className="text-muted">/</span>
        <span>{story.title}</span>
      </div>

      {story.coverImage && (
        <div className="relative mb-6 aspect-[21/9] overflow-hidden border-[3px] border-ink shadow-[6px_6px_0_0_#0a0a0a]">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
            quality={80}
            sizes="100vw"
          />
        </div>
      )}

      <div className="border-[3px] border-ink bg-accent-cyan p-5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-6">
        <span className="brutal-stamp bg-gold text-ink">Story</span>
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/75">
          {formatDate(story.createdAt)}
          {story.region ? ` · ${story.region.name}` : ""}
        </p>
        <h1 className="mt-2 font-display text-3xl uppercase leading-[0.95] text-ink sm:text-5xl">
          {story.title}
        </h1>
        {story.summary && (
          <p className="mt-4 max-w-3xl border-l-4 border-ink bg-bg-page p-3 font-serif text-base leading-relaxed text-ink shadow-[3px_3px_0_0_#0a0a0a] sm:text-lg">
            {story.summary}
          </p>
        )}
      </div>

      {(story.tags?.length ?? 0) > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(story.tags ?? []).map((t) => (
            <span
              key={t.id}
              className="border-2 border-ink bg-white px-2 py-1 text-xs font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]"
            >
              {t.name}
            </span>
          ))}
        </div>
      )}

      {story.content && (
        <div className="mt-6 border-[3px] border-ink bg-white p-5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8">
          <div
            className="prose-archive"
            dangerouslySetInnerHTML={{ __html: ensureHtml(story.content) }}
          />
        </div>
      )}

      <div className="mt-6 border-[3px] border-ink bg-gold/40 p-5 shadow-[4px_4px_0_0_#0a0a0a]">
        <ShareButtons title={story.title} url={url} />
      </div>

      {relatedGhosts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 font-display text-2xl uppercase text-ink sm:text-3xl">
            Related Ghosts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedGhosts.map((g) => (
              <GhostCard key={g.id} ghost={g} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

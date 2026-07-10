import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DangerBadge } from "@/components/public/DangerBadge";
import { GhostCard } from "@/components/public/GhostCard";
import { ShareButtons } from "@/components/public/ShareButtons";
import { ensureHtml } from "@/lib/sanitize";
import {
  ghostTypeLabel,
  ghostTypeSlug,
  dangerLabel,
} from "@/lib/utils";
import { buildMetadata, getSiteUrl, ghostJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const ghost = await prisma.ghost.findFirst({
      where: { slug, status: "PUBLISHED" },
    });
    if (!ghost) return { title: "Not found" };
    return buildMetadata({
      title:
        ghost.seoTitle ||
        `${ghost.name} - The ${ghostTypeLabel(ghost.type)} of Indian Folklore`,
      description:
        ghost.seoDescription ||
        ghost.summary ||
        `Learn about ${ghost.name}, including origin, appearance, and regional legends.`,
      path: `/ghosts/${ghost.slug}`,
      image: ghost.image,
    });
  } catch {
    return { title: "Ghost" };
  }
}

export default async function GhostDetailPage({ params }: Props) {
  const { slug } = await params;

  let ghost;
  try {
    ghost = await prisma.ghost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        region: true,
        tags: true,
        relatedGhosts: {
          take: 8,
          include: { region: { select: { name: true, slug: true } } },
        },
      },
    });
  } catch (err) {
    console.error("[ghost detail]", slug, err);
    throw err;
  }

  if (!ghost) notFound();

  prisma.ghost
    .update({
      where: { id: ghost.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  const url = `${getSiteUrl()}/ghosts/${ghost.slug}`;
  const relatedGhosts = (ghost.relatedGhosts ?? [])
    .filter((g) => g.status === "PUBLISHED")
    .slice(0, 4);
  const tags = ghost.tags ?? [];
  const gallery = ghost.gallery ?? [];

  return (
    <article className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ghostJsonLd(ghost)),
        }}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2 border-[3px] border-ink bg-white px-3 py-2 text-xs font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
        <Link href="/ghosts" className="hover:text-saffron">
          Ghosts
        </Link>
        <span className="text-muted">/</span>
        <span>{ghost.name}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-[3px] border-ink bg-gold p-4 shadow-[6px_6px_0_0_#0a0a0a] sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <DangerBadge level={ghost.dangerLevel} />
            <Link
              href={`/types/${ghostTypeSlug(ghost.type)}`}
              className="border-2 border-ink bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a] hover:bg-accent-cyan"
            >
              {ghostTypeLabel(ghost.type)}
            </Link>
          </div>
          <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-ink sm:text-5xl lg:text-6xl">
            {ghost.name}
          </h1>
          {(ghost.otherNames?.length ?? 0) > 0 && (
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-ink/70">
              Also known as: {(ghost.otherNames ?? []).join(" · ")}
            </p>
          )}
          {ghost.summary && (
            <p className="mt-5 border-l-4 border-ink bg-bg-page p-3 font-serif text-base leading-relaxed text-ink shadow-[3px_3px_0_0_#0a0a0a]">
              {ghost.summary}
            </p>
          )}

          <dl className="mt-5 grid gap-2 sm:grid-cols-2">
            {ghost.region && (
              <MetaBox label="Region">
                <Link
                  href={`/regions/${ghost.region.slug}`}
                  className="font-bold underline decoration-2 underline-offset-2"
                >
                  {ghost.region.name}
                </Link>
              </MetaBox>
            )}
            {ghost.state && <MetaBox label="State">{ghost.state}</MetaBox>}
            <MetaBox label="Danger">{dangerLabel(ghost.dangerLevel)}</MetaBox>
            {ghost.habitat && <MetaBox label="Habitat">{ghost.habitat}</MetaBox>}
          </dl>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden border-[3px] border-ink bg-ink shadow-[6px_6px_0_0_#0a0a0a]">
          {ghost.image ? (
            <Image
              src={ghost.image}
              alt={ghost.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-6xl text-gold">
              ◈
            </div>
          )}
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.map((img, i) => (
            <div
              key={i}
              className="relative aspect-video overflow-hidden border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a]"
            >
              <Image
                src={img}
                alt={`${ghost.name} gallery ${i + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[
            { title: "Appearance", body: ghost.appearance },
            { title: "Behavior", body: ghost.behavior },
            { title: "Origin", body: ghost.origin },
            { title: "Full Account", body: ghost.fullDescription, html: true },
            { title: "Cultural Notes", body: ghost.culturalNotes },
            { title: "Sources & References", body: ghost.sources },
          ].map(
            (section) =>
              section.body && (
                <section
                  key={section.title}
                  className="border-[3px] border-ink bg-white p-4 shadow-[4px_4px_0_0_#0a0a0a] sm:p-5"
                >
                  <h2 className="font-display text-xl uppercase text-ink sm:text-2xl">
                    {section.title}
                  </h2>
                  {section.html ? (
                    <div
                      className="prose-archive mt-3"
                      dangerouslySetInnerHTML={{
                        __html: ensureHtml(section.body),
                      }}
                    />
                  ) : (
                    <p className="mt-3 whitespace-pre-line font-serif text-sm leading-relaxed text-ink/90 sm:text-base">
                      {section.body}
                    </p>
                  )}
                </section>
              )
          )}
        </div>

        <aside className="space-y-4">
          {tags.length > 0 && (
            <div className="border-[3px] border-ink bg-accent-cyan p-4 shadow-[4px_4px_0_0_#0a0a0a]">
              <h3 className="font-display text-xs uppercase text-ink">Tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="border-2 border-ink bg-white px-2 py-1 text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="border-[3px] border-ink bg-white p-4 shadow-[4px_4px_0_0_#0a0a0a]">
            <ShareButtons title={ghost.name} url={url} />
          </div>
          <Link
            href="/ghosts"
            className="brutal-btn brutal-btn-ghost flex w-full !text-[11px]"
          >
            ← Back to encyclopedia
          </Link>
        </aside>
      </div>

      {relatedGhosts.length > 0 && (
        <section className="mt-10 border-t-[3px] border-ink pt-6">
          <h2 className="mb-4 font-display text-2xl uppercase text-ink">
            Related Spirits
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedGhosts.map((g) => (
              <GhostCard key={g.id} ghost={g} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function MetaBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-[3px] border-ink bg-white p-3 shadow-[2px_2px_0_0_#0a0a0a]">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold text-ink">{children}</dd>
    </div>
  );
}

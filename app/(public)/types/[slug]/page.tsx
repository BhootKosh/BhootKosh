import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GhostCard } from "@/components/public/GhostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ghostTypeFromSlug, ghostTypeLabel } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { GhostType } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const type = ghostTypeFromSlug(slug);
  if (!type) return { title: "Type" };
  return buildMetadata({
    title: `${ghostTypeLabel(type)} in Indian Folklore`,
    description: `Explore ${ghostTypeLabel(type).toLowerCase()} documented in the BhootKosh archive.`,
    path: `/types/${slug}`,
  });
}

export default async function TypeDetailPage({ params }: Props) {
  const { slug } = await params;
  const type = ghostTypeFromSlug(slug);
  if (!type) notFound();

  let ghosts: Awaited<ReturnType<typeof prisma.ghost.findMany>> = [];
  try {
    ghosts = await prisma.ghost.findMany({
      where: { status: "PUBLISHED", type: type as GhostType },
      orderBy: { name: "asc" },
      include: { region: { select: { name: true, slug: true } } },
    });
  } catch {
    /* empty */
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mb-5 flex flex-wrap items-center gap-2 border-[3px] border-ink bg-white px-3 py-2 text-xs font-bold uppercase text-ink shadow-[3px_3px_0_0_#0a0a0a]">
        <Link href="/types" className="hover:text-saffron">
          Types
        </Link>
        <span className="text-muted">/</span>
        <span>{ghostTypeLabel(type)}</span>
      </div>

      <div className="border-[3px] border-ink bg-gold p-5 shadow-[6px_6px_0_0_#0a0a0a] sm:p-6">
        <span className="chapter-label">Spirit type</span>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-ink sm:text-5xl">
          {ghostTypeLabel(type)}
        </h1>
        <p className="mt-2 text-sm font-bold uppercase text-ink/75">
          {ghosts.length} published entr{ghosts.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {ghosts.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No spirits in this category yet" />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ghosts.map((g) => (
            <GhostCard key={g.id} ghost={g} />
          ))}
        </div>
      )}
    </div>
  );
}

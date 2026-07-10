import { prisma } from "@/lib/prisma";
import { TypeCard } from "@/components/public/TypeCard";
import { GHOST_TYPES } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Spirit Types",
  description:
    "Browse Indian folklore by spirit type: female spirits, demons, forest spirits, and more.",
  path: "/types",
});

export const dynamic = "force-dynamic";

export default async function TypesPage() {
  let counts: Record<string, number> = {};
  try {
    const groups = await prisma.ghost.groupBy({
      by: ["type"],
      where: { status: "PUBLISHED" },
      _count: true,
    });
    counts = Object.fromEntries(groups.map((g) => [g.type, g._count]));
  } catch {
    /* empty */
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <span className="chapter-label">Taxonomy</span>
      <h1 className="mt-2 font-display text-3xl uppercase text-ink sm:text-5xl">
        Spirit Types
      </h1>
      <p className="mt-2 max-w-2xl font-serif text-sm text-muted">
        Categories used across the BhootKosh archive to organise diverse
        traditions of Indian folklore.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GHOST_TYPES.map((t, i) => (
          <TypeCard key={t} type={t} count={counts[t] || 0} index={i} />
        ))}
      </div>
    </div>
  );
}

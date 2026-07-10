import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GhostForm } from "@/components/admin/GhostForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditGhostPage({ params }: Props) {
  const { id } = await params;
  const [ghost, regions, tags, ghosts] = await Promise.all([
    prisma.ghost.findUnique({
      where: { id },
      include: {
        tags: true,
        relatedGhosts: { select: { id: true, name: true } },
      },
    }),
    prisma.region.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.ghost.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!ghost) notFound();

  return (
    <>
      <AdminHeader title={`Edit: ${ghost.name}`} />
      <GhostForm
        mode="edit"
        initial={ghost}
        regions={regions}
        tags={tags}
        ghosts={ghosts}
      />
    </>
  );
}

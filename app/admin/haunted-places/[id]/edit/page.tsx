import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { HauntedPlaceForm } from "@/components/admin/HauntedPlaceForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditHauntedPlacePage({ params }: Props) {
  const { id } = await params;
  const [place, regions, tags, ghosts] = await Promise.all([
    prisma.hauntedPlace.findUnique({
      where: { id },
      include: {
        tags: true,
        relatedGhosts: { select: { id: true, name: true } },
      },
    }),
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.ghost.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!place) notFound();

  return (
    <>
      <AdminHeader title={`Edit: ${place.name}`} />
      <HauntedPlaceForm
        mode="edit"
        initial={place}
        regions={regions}
        tags={tags}
        ghosts={ghosts}
      />
    </>
  );
}

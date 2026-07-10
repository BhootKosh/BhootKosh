import { AdminHeader } from "@/components/admin/AdminHeader";
import { HauntedPlaceForm } from "@/components/admin/HauntedPlaceForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewHauntedPlacePage() {
  const [regions, tags, ghosts] = await Promise.all([
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.ghost.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <>
      <AdminHeader title="Create haunted place" />
      <HauntedPlaceForm mode="create" regions={regions} tags={tags} ghosts={ghosts} />
    </>
  );
}

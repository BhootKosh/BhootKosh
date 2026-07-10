import { AdminHeader } from "@/components/admin/AdminHeader";
import { GhostForm } from "@/components/admin/GhostForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewGhostPage() {
  const [regions, tags, ghosts] = await Promise.all([
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

  return (
    <>
      <AdminHeader title="Create ghost" />
      <GhostForm
        mode="create"
        regions={regions}
        tags={tags}
        ghosts={ghosts}
      />
    </>
  );
}

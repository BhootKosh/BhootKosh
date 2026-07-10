import { AdminHeader } from "@/components/admin/AdminHeader";
import { StoryForm } from "@/components/admin/StoryForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewStoryPage() {
  const [regions, tags, ghosts] = await Promise.all([
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.ghost.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <>
      <AdminHeader title="Create story" />
      <StoryForm mode="create" regions={regions} tags={tags} ghosts={ghosts} />
    </>
  );
}

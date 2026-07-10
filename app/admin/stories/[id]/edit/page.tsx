import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StoryForm } from "@/components/admin/StoryForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;
  const [story, regions, tags, ghosts] = await Promise.all([
    prisma.story.findUnique({
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
  if (!story) notFound();

  return (
    <>
      <AdminHeader title={`Edit: ${story.title}`} />
      <StoryForm
        mode="edit"
        initial={story}
        regions={regions}
        tags={tags}
        ghosts={ghosts}
      />
    </>
  );
}

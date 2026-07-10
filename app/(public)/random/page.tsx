import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RandomGhostPage() {
  let slug: string | null = null;

  try {
    const count = await prisma.ghost.count({
      where: { status: "PUBLISHED" },
    });
    if (count > 0) {
      const skip = Math.floor(Math.random() * count);
      const ghost = await prisma.ghost.findFirst({
        where: { status: "PUBLISHED" },
        skip,
        select: { slug: true },
      });
      slug = ghost?.slug ?? null;
    }
  } catch {
    slug = null;
  }

  redirect(slug ? `/ghosts/${slug}` : "/ghosts");
}

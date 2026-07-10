import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalGhosts,
      totalPlaces,
      totalStories,
      pendingSubmissions,
      publishedGhosts,
      draftGhosts,
      publishedPlaces,
      draftPlaces,
      publishedStories,
      draftStories,
      recentGhosts,
      recentSubmissions,
    ] = await Promise.all([
      prisma.ghost.count(),
      prisma.hauntedPlace.count(),
      prisma.story.count(),
      prisma.submission.count({ where: { status: "PENDING" } }),
      prisma.ghost.count({ where: { status: "PUBLISHED" } }),
      prisma.ghost.count({ where: { status: "DRAFT" } }),
      prisma.hauntedPlace.count({ where: { status: "PUBLISHED" } }),
      prisma.hauntedPlace.count({ where: { status: "DRAFT" } }),
      prisma.story.count({ where: { status: "PUBLISHED" } }),
      prisma.story.count({ where: { status: "DRAFT" } }),
      prisma.ghost.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.submission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, status: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      totalGhosts,
      totalPlaces,
      totalStories,
      pendingSubmissions,
      publishedEntries: publishedGhosts + publishedPlaces + publishedStories,
      draftEntries: draftGhosts + draftPlaces + draftStories,
      publishedGhosts,
      draftGhosts,
      recentGhosts,
      recentSubmissions,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

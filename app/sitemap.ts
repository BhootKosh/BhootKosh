import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";
import { GHOST_TYPES, ghostTypeSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/ghosts",
    "/regions",
    "/types",
    "/haunted-places",
    "/stories",
    "/random",
    "/submit",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const typeRoutes: MetadataRoute.Sitemap = GHOST_TYPES.map((t) => ({
    url: `${base}/types/${ghostTypeSlug(t)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  try {
    const [ghosts, places, stories, regions] = await Promise.all([
      prisma.ghost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.hauntedPlace.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.story.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.region.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...typeRoutes,
      ...regions.map((r) => ({
        url: `${base}/regions/${r.slug}`,
        lastModified: r.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...ghosts.map((g) => ({
        url: `${base}/ghosts/${g.slug}`,
        lastModified: g.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      })),
      ...places.map((p) => ({
        url: `${base}/haunted-places/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...stories.map((s) => ({
        url: `${base}/stories/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return [...staticRoutes, ...typeRoutes];
  }
}

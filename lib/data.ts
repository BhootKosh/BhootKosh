import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { DangerLevel, GhostType, Prisma } from "@prisma/client";

/** Shared revalidate window for public archive pages (seconds). */
export const ARCHIVE_REVALIDATE = 120;

const ghostCardSelect = {
  id: true,
  name: true,
  slug: true,
  type: true,
  dangerLevel: true,
  summary: true,
  image: true,
  state: true,
  region: { select: { name: true, slug: true } },
} satisfies Prisma.GhostSelect;

const placeCardSelect = {
  id: true,
  name: true,
  slug: true,
  location: true,
  state: true,
  legend: true,
  images: true,
  region: { select: { name: true } },
} satisfies Prisma.HauntedPlaceSelect;

const storyCardSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  coverImage: true,
  createdAt: true,
  region: { select: { name: true } },
} satisfies Prisma.StorySelect;

/** Homepage payload — one cached round-trip set */
export const getHomeData = unstable_cache(
  async () => {
    const [featuredGhosts, places, stories, regions, typeGroups] =
      await Promise.all([
        prisma.ghost.findMany({
          where: { status: "PUBLISHED", featured: true },
          take: 6,
          orderBy: { updatedAt: "desc" },
          select: ghostCardSelect,
        }),
        prisma.hauntedPlace.findMany({
          where: { status: "PUBLISHED" },
          take: 3,
          orderBy: { updatedAt: "desc" },
          select: placeCardSelect,
        }),
        prisma.story.findMany({
          where: { status: "PUBLISHED" },
          take: 3,
          orderBy: { createdAt: "desc" },
          select: storyCardSelect,
        }),
        getRegionsForMap(),
        prisma.ghost.groupBy({
          by: ["type"],
          where: { status: "PUBLISHED" },
          _count: true,
        }),
      ]);

    const typeCounts = Object.fromEntries(
      typeGroups.map((g) => [g.type, g._count])
    );

    return { featuredGhosts, places, stories, regions, typeCounts };
  },
  ["home-data"],
  {
    revalidate: ARCHIVE_REVALIDATE,
    tags: ["home", "ghosts", "places", "stories", "regions"],
  }
);

/** Regions for map — batched counts (no N+1) */
export async function getRegionsForMap() {
  const [regions, ghostCounts, placeCounts, storyCounts] = await Promise.all([
    prisma.region.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        state: true,
        ghosts: {
          where: { status: "PUBLISHED" },
          take: 4,
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            dangerLevel: true,
          },
        },
      },
    }),
    prisma.ghost.groupBy({
      by: ["regionId"],
      where: { status: "PUBLISHED", regionId: { not: null } },
      _count: true,
    }),
    prisma.hauntedPlace.groupBy({
      by: ["regionId"],
      where: { status: "PUBLISHED", regionId: { not: null } },
      _count: true,
    }),
    prisma.story.groupBy({
      by: ["regionId"],
      where: { status: "PUBLISHED", regionId: { not: null } },
      _count: true,
    }),
  ]);

  const gMap = Object.fromEntries(
    ghostCounts.map((c) => [c.regionId as string, c._count])
  );
  const pMap = Object.fromEntries(
    placeCounts.map((c) => [c.regionId as string, c._count])
  );
  const sMap = Object.fromEntries(
    storyCounts.map((c) => [c.regionId as string, c._count])
  );

  return regions.map((r) => ({
    ...r,
    _count: {
      ghosts: gMap[r.id] || 0,
      hauntedPlaces: pMap[r.id] || 0,
      stories: sMap[r.id] || 0,
    },
  }));
}

export const getCachedRegionsForMap = unstable_cache(
  async () => getRegionsForMap(),
  ["regions-map"],
  { revalidate: ARCHIVE_REVALIDATE, tags: ["regions", "ghosts"] }
);

export const getCachedRegionList = unstable_cache(
  async () =>
    prisma.region.findMany({
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
  ["regions-list"],
  { revalidate: ARCHIVE_REVALIDATE, tags: ["regions"] }
);

export const getCachedTypeCounts = unstable_cache(
  async () => {
    const groups = await prisma.ghost.groupBy({
      by: ["type"],
      where: { status: "PUBLISHED" },
      _count: true,
    });
    return Object.fromEntries(groups.map((g) => [g.type, g._count]));
  },
  ["type-counts"],
  { revalidate: ARCHIVE_REVALIDATE, tags: ["ghosts"] }
);

export type GhostListParams = {
  q?: string;
  type?: string;
  region?: string;
  danger?: string;
  habitat?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export async function getGhostList(params: GhostListParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(24, Math.max(1, params.pageSize || 12));
  const skip = (page - 1) * pageSize;

  const where: Prisma.GhostWhereInput = { status: "PUBLISHED" };
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { otherNames: { has: params.q } },
      { summary: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.type) where.type = params.type as GhostType;
  if (params.danger) where.dangerLevel = params.danger as DangerLevel;
  if (params.habitat) {
    where.habitat = { contains: params.habitat, mode: "insensitive" };
  }
  if (params.region) where.region = { slug: params.region };

  let orderBy: Prisma.GhostOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "name") orderBy = { name: "asc" };
  if (params.sort === "popularity") orderBy = { viewCount: "desc" };

  const cacheKey = [
    "ghost-list",
    params.q || "",
    params.type || "",
    params.region || "",
    params.danger || "",
    params.habitat || "",
    params.sort || "newest",
    String(page),
    String(pageSize),
  ];

  const fetchList = unstable_cache(
    async () => {
      const [ghosts, total] = await Promise.all([
        prisma.ghost.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          select: ghostCardSelect,
        }),
        prisma.ghost.count({ where }),
      ]);
      return { ghosts, total };
    },
    cacheKey,
    { revalidate: ARCHIVE_REVALIDATE, tags: ["ghosts"] }
  );

  const [{ ghosts, total }, regions] = await Promise.all([
    fetchList(),
    getCachedRegionList(),
  ]);

  return { ghosts, total, regions, page, pageSize };
}

export type PlaceListParams = {
  q?: string;
  region?: string;
  page?: number;
  pageSize?: number;
};

export async function getPlaceList(params: PlaceListParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(24, Math.max(1, params.pageSize || 12));
  const skip = (page - 1) * pageSize;

  const where: Prisma.HauntedPlaceWhereInput = { status: "PUBLISHED" };
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { location: { contains: params.q, mode: "insensitive" } },
      { legend: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.region) where.region = { slug: params.region };

  const cacheKey = [
    "place-list",
    params.q || "",
    params.region || "",
    String(page),
    String(pageSize),
  ];

  const fetchList = unstable_cache(
    async () => {
      const [places, total] = await Promise.all([
        prisma.hauntedPlace.findMany({
          where,
          orderBy: { name: "asc" },
          skip,
          take: pageSize,
          select: placeCardSelect,
        }),
        prisma.hauntedPlace.count({ where }),
      ]);
      return { places, total };
    },
    cacheKey,
    { revalidate: ARCHIVE_REVALIDATE, tags: ["places"] }
  );

  const [{ places, total }, regions] = await Promise.all([
    fetchList(),
    getCachedRegionList(),
  ]);

  return { places, total, regions, page, pageSize };
}

export type StoryListParams = {
  q?: string;
  region?: string;
  page?: number;
  pageSize?: number;
};

export async function getStoryList(params: StoryListParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(24, Math.max(1, params.pageSize || 9));
  const skip = (page - 1) * pageSize;

  const where: Prisma.StoryWhereInput = { status: "PUBLISHED" };
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { summary: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.region) where.region = { slug: params.region };

  const cacheKey = [
    "story-list",
    params.q || "",
    params.region || "",
    String(page),
    String(pageSize),
  ];

  const fetchList = unstable_cache(
    async () => {
      const [stories, total] = await Promise.all([
        prisma.story.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
          select: storyCardSelect,
        }),
        prisma.story.count({ where }),
      ]);
      return { stories, total };
    },
    cacheKey,
    { revalidate: ARCHIVE_REVALIDATE, tags: ["stories"] }
  );

  const [{ stories, total }, regions] = await Promise.all([
    fetchList(),
    getCachedRegionList(),
  ]);

  return { stories, total, regions, page, pageSize };
}

export const getCachedGhostBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.ghost.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: {
          region: true,
          tags: true,
          relatedGhosts: {
            take: 8,
            select: {
              ...ghostCardSelect,
              status: true,
            },
          },
        },
      }),
    [`ghost-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["ghosts", `ghost-${slug}`] }
  )();

export const getCachedGhostMeta = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.ghost.findFirst({
        where: { slug, status: "PUBLISHED" },
        select: {
          name: true,
          slug: true,
          type: true,
          summary: true,
          image: true,
          seoTitle: true,
          seoDescription: true,
        },
      }),
    [`ghost-meta-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["ghosts", `ghost-${slug}`] }
  )();

export const getCachedPlaceBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.hauntedPlace.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: {
          region: true,
          tags: true,
          relatedGhosts: {
            take: 8,
            select: {
              ...ghostCardSelect,
              status: true,
            },
          },
          relatedStories: {
            take: 6,
            select: {
              ...storyCardSelect,
              status: true,
            },
          },
        },
      }),
    [`place-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["places", `place-${slug}`] }
  )();

export const getCachedPlaceMeta = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.hauntedPlace.findFirst({
        where: { slug, status: "PUBLISHED" },
        select: {
          name: true,
          slug: true,
          legend: true,
          images: true,
          seoTitle: true,
          seoDescription: true,
        },
      }),
    [`place-meta-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["places", `place-${slug}`] }
  )();

export const getCachedStoryBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.story.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: {
          region: true,
          tags: true,
          relatedGhosts: {
            take: 8,
            select: {
              ...ghostCardSelect,
              status: true,
            },
          },
        },
      }),
    [`story-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["stories", `story-${slug}`] }
  )();

export const getCachedStoryMeta = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.story.findFirst({
        where: { slug, status: "PUBLISHED" },
        select: {
          title: true,
          slug: true,
          summary: true,
          coverImage: true,
          seoTitle: true,
          seoDescription: true,
        },
      }),
    [`story-meta-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["stories", `story-${slug}`] }
  )();

export const getCachedRegionBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.region.findUnique({
        where: { slug },
        include: {
          ghosts: {
            where: { status: "PUBLISHED" },
            select: ghostCardSelect,
            orderBy: { name: "asc" },
          },
          hauntedPlaces: {
            where: { status: "PUBLISHED" },
            select: placeCardSelect,
            orderBy: { name: "asc" },
          },
          stories: {
            where: { status: "PUBLISHED" },
            select: storyCardSelect,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    [`region-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["regions", `region-${slug}`] }
  )();

export const getCachedRegionMeta = (slug: string) =>
  unstable_cache(
    async () =>
      prisma.region.findUnique({
        where: { slug },
        select: {
          name: true,
          slug: true,
          description: true,
          image: true,
        },
      }),
    [`region-meta-${slug}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["regions", `region-${slug}`] }
  )();

export const getCachedGhostsByType = (type: GhostType) =>
  unstable_cache(
    async () =>
      prisma.ghost.findMany({
        where: { status: "PUBLISHED", type },
        orderBy: { name: "asc" },
        select: ghostCardSelect,
      }),
    [`ghosts-type-${type}`],
    { revalidate: ARCHIVE_REVALIDATE, tags: ["ghosts"] }
  )();

/** Fire-and-forget view bump — never blocks page render */
export function bumpGhostView(id: string) {
  // Do not mutate DB while statically generating pages at build time
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  void prisma.ghost
    .update({ where: { id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});
}

/** Build-time path params for static generation */
export async function getPublishedGhostSlugs() {
  try {
    return prisma.ghost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getPublishedPlaceSlugs() {
  try {
    return prisma.hauntedPlace.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getPublishedStorySlugs() {
  try {
    return prisma.story.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getRegionSlugs() {
  try {
    return prisma.region.findMany({ select: { slug: true } });
  } catch {
    return [] as { slug: string }[];
  }
}

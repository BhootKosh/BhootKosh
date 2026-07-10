import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hauntedPlaceSchema } from "@/lib/validators";
import { sanitizeSlug } from "@/lib/utils";
import { revalidateArchive } from "@/lib/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const place = await prisma.hauntedPlace.findUnique({
      where: { id },
      include: {
        tags: true,
        relatedGhosts: { select: { id: true, name: true } },
        region: true,
      },
    });
    if (!place) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(place);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = hauntedPlaceSchema.safeParse({
      ...body,
      slug: sanitizeSlug(body.slug || body.name || ""),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const place = await prisma.hauntedPlace.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        location: data.location || null,
        state: data.state || null,
        regionId: data.regionId || null,
        history: data.history || null,
        legend: data.legend || null,
        reportedActivity: data.reportedActivity || null,
        warning: data.warning || null,
        images: data.images,
        status: data.status,
        featured: data.featured,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        tags: { set: data.tagIds.map((tid) => ({ id: tid })) },
        relatedGhosts: {
          set: data.relatedGhostIds.map((rid) => ({ id: rid })),
        },
      },
    });
    revalidateArchive("home", "places", "regions", `place-${place.slug}`);
    return NextResponse.json(place);
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const existing = await prisma.hauntedPlace.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.hauntedPlace.delete({ where: { id } });
    revalidateArchive(
      "home",
      "places",
      "regions",
      existing?.slug ? `place-${existing.slug}` : "places"
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

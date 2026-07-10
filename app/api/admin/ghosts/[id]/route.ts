import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ghostSchema } from "@/lib/validators";
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
    const ghost = await prisma.ghost.findUnique({
      where: { id },
      include: {
        tags: true,
        relatedGhosts: { select: { id: true, name: true } },
        region: true,
      },
    });
    if (!ghost) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(ghost);
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
    const parsed = ghostSchema.safeParse({
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
    const ghost = await prisma.ghost.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        otherNames: data.otherNames,
        type: data.type,
        regionId: data.regionId || null,
        state: data.state || null,
        dangerLevel: data.dangerLevel,
        habitat: data.habitat || null,
        appearance: data.appearance || null,
        behavior: data.behavior || null,
        origin: data.origin || null,
        summary: data.summary || null,
        fullDescription: data.fullDescription || null,
        culturalNotes: data.culturalNotes || null,
        sources: data.sources || null,
        image: data.image || null,
        gallery: data.gallery,
        status: data.status,
        featured: data.featured,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        tags: { set: data.tagIds.map((tid) => ({ id: tid })) },
        relatedGhosts: {
          set: data.relatedGhostIds
            .filter((rid) => rid !== id)
            .map((rid) => ({ id: rid })),
        },
      },
    });

    revalidateArchive("home", "ghosts", "regions", `ghost-${ghost.slug}`);
    return NextResponse.json(ghost);
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
    const existing = await prisma.ghost.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.ghost.delete({ where: { id } });
    revalidateArchive(
      "home",
      "ghosts",
      "regions",
      existing?.slug ? `ghost-${existing.slug}` : "ghosts"
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

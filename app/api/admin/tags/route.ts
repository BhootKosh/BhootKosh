import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tagSchema } from "@/lib/validators";
import { sanitizeSlug } from "@/lib/utils";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = tagSchema.safeParse({
      ...body,
      slug: sanitizeSlug(body.slug || body.name || ""),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const tag = await prisma.tag.create({
      data: { name: parsed.data.name, slug: parsed.data.slug },
    });
    return NextResponse.json(tag, { status: 201 });
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

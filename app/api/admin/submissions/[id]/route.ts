import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraphsFromPlainText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const action = body.action as string;

    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (action === "approve") {
      const updated = await prisma.submission.update({
        where: { id },
        data: { status: "APPROVED", adminNotes: body.adminNotes || null },
      });
      return NextResponse.json(updated);
    }

    if (action === "reject") {
      const updated = await prisma.submission.update({
        where: { id },
        data: { status: "REJECTED", adminNotes: body.adminNotes || null },
      });
      return NextResponse.json(updated);
    }

    if (action === "convert-ghost") {
      let slug = createSlug(submission.name);
      const existing = await prisma.ghost.findUnique({ where: { slug } });
      if (existing) slug = `${slug}-${Date.now().toString(36)}`;

      const ghost = await prisma.ghost.create({
        data: {
          name: submission.name,
          slug,
          type: "VILLAGE_SPIRITS",
          state: submission.regionText,
          summary: submission.story.slice(0, 400),
          fullDescription: paragraphsFromPlainText(submission.story),
          origin: `Submitted as public legend from ${submission.regionText}.`,
          status: "DRAFT",
          dangerLevel: "UNKNOWN",
          sources: `Public submission (${submission.sourceType})`,
        },
      });

      const updated = await prisma.submission.update({
        where: { id },
        data: {
          status: "APPROVED",
          convertedGhostId: ghost.id,
        },
      });

      return NextResponse.json({ submission: updated, ghost });
    }

    if (action === "convert-story") {
      let slug = createSlug(submission.name);
      const existing = await prisma.story.findUnique({ where: { slug } });
      if (existing) slug = `${slug}-${Date.now().toString(36)}`;

      const story = await prisma.story.create({
        data: {
          title: submission.name,
          slug,
          summary: submission.story.slice(0, 300),
          content: paragraphsFromPlainText(submission.story),
          status: "DRAFT",
        },
      });

      const updated = await prisma.submission.update({
        where: { id },
        data: {
          status: "APPROVED",
          convertedStoryId: story.id,
        },
      });

      return NextResponse.json({ submission: updated, story });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
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
    await prisma.submission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

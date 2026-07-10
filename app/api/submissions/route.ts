import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validators";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limited = rateLimit(
    `submit:${ip}`,
    RATE_LIMITS.submit.limit,
    RATE_LIMITS.submit.windowMs
  );
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const submission = await prisma.submission.create({
      data: {
        name: data.name.trim(),
        regionText: data.regionText.trim(),
        story: data.story.trim(),
        sourceType: data.sourceType,
        contactEmail: data.contactEmail?.trim() || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ id: submission.id, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

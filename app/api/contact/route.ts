import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limited = rateLimit(
    `contact:${ip}`,
    RATE_LIMITS.contact.limit,
    RATE_LIMITS.contact.windowMs
  );
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    await prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

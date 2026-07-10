import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";
import { AuthError } from "next-auth";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limited = rateLimit(
    `login:${ip}`,
    RATE_LIMITS.login.limit,
    RATE_LIMITS.login.windowMs
  );
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

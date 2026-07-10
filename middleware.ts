import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge middleware — JWT cookie check only.
 * Uses next-auth/jwt (Edge-safe). Does NOT import Prisma or full Auth config.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  let isLoggedIn = false;
  if (secret) {
    try {
      const token = await getToken({ req, secret });
      isLoggedIn = Boolean(token?.email || token?.sub);
    } catch (err) {
      console.warn("[middleware] getToken failed", err);
      isLoggedIn = false;
    }
  }

  const isAdminPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if ((isAdminPage || isAdminApi) && !isLoggedIn) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // req.auth may be null if JWT is missing OR invalid/stale
  const isLoggedIn = Boolean(req.auth?.user);

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
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

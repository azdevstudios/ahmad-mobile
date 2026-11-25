import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-constants";
import { verifyAdminToken } from "@/lib/auth-token";

const publicAdminPages = new Set([
  "/admin/login",
  "/admin/setup",
  "/admin/forgot-password",
  "/admin/reset-password",
]);

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const session = await verifyAdminToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (publicAdminPages.has(pathname)) {
    if (session && (pathname === "/admin/login" || pathname === "/admin/setup")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };

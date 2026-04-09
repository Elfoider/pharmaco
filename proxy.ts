import { NextResponse, type NextRequest } from "next/server";

import { DASHBOARD_ACCESS_ROLES, roleSchema } from "@/lib/auth/roles";
import { SESSION_COOKIE_NAME, SESSION_ROLE_COOKIE_NAME } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const roleCandidate = request.cookies.get(SESSION_ROLE_COOKIE_NAME)?.value;
  const role = roleSchema.safeParse(roleCandidate);

  if (pathname.startsWith("/dashboard")) {
    if (!session || !role.success || !DASHBOARD_ACCESS_ROLES.includes(role.data)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" && session && role.success) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};

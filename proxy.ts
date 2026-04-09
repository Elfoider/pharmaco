import { NextResponse, type NextRequest } from "next/server";

import { canAccessPath, userRoleSchema } from "@/lib/auth/roles";
import { ROLE_COOKIE, SESSION_COOKIE } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get(SESSION_COOKIE)?.value;
    const roleCandidate = request.cookies.get(ROLE_COOKIE)?.value;
    const role = userRoleSchema.safeParse(roleCandidate);

    if (!session || !role.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!canAccessPath(role.data, pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname === "/login") {
    const session = request.cookies.get(SESSION_COOKIE)?.value;
    const roleCandidate = request.cookies.get(ROLE_COOKIE)?.value;
    const role = userRoleSchema.safeParse(roleCandidate);

    if (session && role.success) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};

import { userRoleSchema, type UserRole } from "@/lib/auth/roles";

export const SESSION_COOKIE = "pharmaco_session";
export const ROLE_COOKIE = "pharmaco_role";

const MAX_AGE_SECONDS = 60 * 60 * 8;

export function setClientSession(role: UserRole) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const common = `; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;

  document.cookie = `${SESSION_COOKIE}=active${common}`;
  document.cookie = `${ROLE_COOKIE}=${role}${common}`;
}

export function clearClientSession() {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getRoleFromCookie(): UserRole | null {
  const roleToken = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${ROLE_COOKIE}=`))
    ?.split("=")[1];

  const parsed = userRoleSchema.safeParse(roleToken);
  return parsed.success ? parsed.data : null;
}

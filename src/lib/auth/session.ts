import type { UserRole } from "@/lib/auth/roles";

export const SESSION_COOKIE_NAME = "pharmaco_session";
export const SESSION_ROLE_COOKIE_NAME = "pharmaco_role";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export function setClientSession(role: UserRole) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const sameSite = "; SameSite=Lax";
  const path = "; Path=/";
  const maxAge = `; Max-Age=${SESSION_MAX_AGE_SECONDS}`;

  document.cookie = `${SESSION_COOKIE_NAME}=active${path}${maxAge}${sameSite}${secure}`;
  document.cookie = `${SESSION_ROLE_COOKIE_NAME}=${role}${path}${maxAge}${sameSite}${secure}`;
}

export function clearClientSession() {
  const path = "; Path=/";
  const sameSite = "; SameSite=Lax";

  document.cookie = `${SESSION_COOKIE_NAME}=; Max-Age=0${path}${sameSite}`;
  document.cookie = `${SESSION_ROLE_COOKIE_NAME}=; Max-Age=0${path}${sameSite}`;
}

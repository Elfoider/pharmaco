import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROLE_COOKIE, SESSION_COOKIE } from "@/lib/auth/session";
import { userRoleSchema } from "@/lib/auth/roles";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  const roleCandidate = cookieStore.get(ROLE_COOKIE)?.value;
  const role = userRoleSchema.safeParse(roleCandidate);

  if (!session || !role.success) {
    redirect("/login");
  }

  return children;
}

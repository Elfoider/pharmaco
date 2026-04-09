import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SESSION_ROLE_COOKIE_NAME } from "@/lib/auth/session";
import { roleSchema } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const roleCandidate = cookieStore.get(SESSION_ROLE_COOKIE_NAME)?.value;
  const parsedRole = roleSchema.safeParse(roleCandidate);

  if (!parsedRole.success) {
    redirect("/login");
  }

  return <DashboardShell role={parsedRole.data} />;
}

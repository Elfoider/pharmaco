import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ROLE_COOKIE } from "@/lib/auth/session";
import { userRoleSchema } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const roleCandidate = cookieStore.get(ROLE_COOKIE)?.value;
  const role = userRoleSchema.safeParse(roleCandidate);

  if (!role.success) {
    redirect("/login");
  }

  return <DashboardShell role={role.data} />;
}

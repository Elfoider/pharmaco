import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { GlassPanel } from "@/components/ui/glass-panel";
import { ROLE_COOKIE } from "@/lib/auth/session";
import { userRoleSchema } from "@/lib/auth/roles";

const ALLOWED_ROLES = ["super_admin", "admin", "rrhh"] as const;

export default async function RrhhPage() {
  const cookieStore = await cookies();
  const roleCandidate = cookieStore.get(ROLE_COOKIE)?.value;
  const role = userRoleSchema.safeParse(roleCandidate);

  if (!role.success || !ALLOWED_ROLES.includes(role.data)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <GlassPanel className="space-y-3">
          <h1 className="text-2xl font-semibold">Módulo RRHH</h1>
          <p className="text-sm text-slate-300">
            Esta ruta está restringida a roles: super_admin, admin y rrhh.
          </p>
        </GlassPanel>
      </div>
    </main>
  );
}

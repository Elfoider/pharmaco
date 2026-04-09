import type { UserRole } from "@/lib/auth/roles";

const roleClasses: Record<UserRole, string> = {
  super_admin: "border-fuchsia-300/35 bg-fuchsia-400/15 text-fuchsia-100",
  admin: "border-cyan-300/35 bg-cyan-400/15 text-cyan-100",
  farmaceutico: "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  cajero: "border-amber-300/35 bg-amber-400/15 text-amber-100",
  almacenista: "border-indigo-300/35 bg-indigo-400/15 text-indigo-100",
  rrhh: "border-rose-300/35 bg-rose-400/15 text-rose-100",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${roleClasses[role]}`}>
      {role}
    </span>
  );
}

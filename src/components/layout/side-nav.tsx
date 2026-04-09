import type { ComponentType } from "react";
import { ChartLine, ClipboardList, LayoutDashboard, Package, UsersRound, Wallet } from "lucide-react";
import Link from "next/link";

import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusChip } from "@/components/ui/status-chip";
import { getRoleNavigation, type UserRole } from "@/lib/auth/roles";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  Inventario: Package,
  Caja: Wallet,
  Farmacia: ClipboardList,
  RRHH: UsersRound,
  Reportes: ChartLine,
};

export function SideNav({ role }: { role: UserRole }) {
  const items = getRoleNavigation(role);

  return (
    <GlassPanel className="h-fit p-3">
      <div className="mb-3 px-2">
        <StatusChip tone="info">Rol: {role}</StatusChip>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.label] ?? LayoutDashboard;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-cyan-400/10 hover:text-cyan-100"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </GlassPanel>
  );
}

"use client";

import type { ComponentType } from "react";
import {
  Bot,
  CalendarClock,
  ClipboardCheck,
  LayoutDashboard,
  Package,
  ShoppingCart,
  UserSquare2,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusChip } from "@/components/ui/status-chip";
import { getRoleNavigation, type UserRole } from "@/lib/auth/roles";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  POS: ShoppingCart,
  Clientes: UserSquare2,
  Empleados: UsersRound,
  Inventario: Package,
  Horarios: CalendarClock,
  Tareas: ClipboardCheck,
  "IA Asistente": Bot,
};

export function SideNav({ role }: { role: UserRole }) {
  const items = getRoleNavigation(role);
  const pathname = usePathname();

  return (
    <GlassPanel className="h-fit p-3">
      <div className="mb-3 flex items-center justify-between px-2">
        <StatusChip tone="info">Rol: {role}</StatusChip>
        <span className="text-[11px] text-slate-400">{items.length} módulos</span>
      </div>
      <nav aria-label="Navegación principal" className="space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.label] ?? LayoutDashboard;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                isActive
                  ? "border-cyan-300/40 bg-cyan-400/14 text-cyan-100"
                  : "border-transparent text-slate-200 hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-100"
              }`}
            >
              <Icon aria-hidden className="h-4 w-4 text-slate-400 transition group-hover:text-cyan-300" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </GlassPanel>
  );
}

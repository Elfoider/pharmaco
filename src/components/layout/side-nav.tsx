import { ChartLine, ClipboardList, LayoutDashboard, Package, UsersRound, Wallet } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusChip } from "@/components/ui/status-chip";

const items = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Package, label: "Inventario" },
  { icon: Wallet, label: "Caja" },
  { icon: ClipboardList, label: "Trazabilidad" },
  { icon: UsersRound, label: "RRHH" },
  { icon: ChartLine, label: "Reportes" },
];

export function SideNav() {
  return (
    <GlassPanel className="h-fit p-3">
      <div className="mb-3 px-2">
        <StatusChip tone="info">Arquitectura Fase 1</StatusChip>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-cyan-400/10 hover:text-cyan-100"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </GlassPanel>
  );
}

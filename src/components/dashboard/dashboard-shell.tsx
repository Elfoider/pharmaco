import {
  Bot,
  CalendarClock,
  ClipboardCheck,
  Package,
  ShoppingCart,
  UserSquare2,
  UsersRound,
} from "lucide-react";

import { GridBackground } from "@/components/ui/grid-background";
import { SectionHeading } from "@/components/ui/section-heading";
import { SideNav } from "@/components/layout/side-nav";
import { TopBar } from "@/components/layout/topbar";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusChip } from "@/components/ui/status-chip";
import type { UserRole } from "@/lib/auth/roles";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ModuleCard } from "@/components/dashboard/module-card";

const moduleCatalog = [
  {
    title: "POS",
    description: "Facturación rápida, control de caja y ventas por turno con trazabilidad.",
    icon: ShoppingCart,
    status: "Mock ready",
  },
  {
    title: "Clientes",
    description: "Historial de compras, perfiles y seguimiento de fidelización.",
    icon: UserSquare2,
    status: "Mock ready",
  },
  {
    title: "Empleados",
    description: "Gestión de personal, estructura operativa y permisos por área.",
    icon: UsersRound,
    status: "Mock ready",
  },
  {
    title: "Inventario",
    description: "Entradas/salidas, stock crítico y control farmacéutico por lote.",
    icon: Package,
    status: "Mock ready",
  },
  {
    title: "Horarios",
    description: "Turnos, cobertura operativa y planificación semanal automatizable.",
    icon: CalendarClock,
    status: "Mock ready",
  },
  {
    title: "Tareas",
    description: "Checklist operativo diario con seguimiento por responsables.",
    icon: ClipboardCheck,
    status: "Mock ready",
  },
  {
    title: "IA Asistente",
    description: "Asistente contextual para decisiones operativas y productividad.",
    icon: Bot,
    status: "Mock ready",
  },
] as const;

export function DashboardShell({ role }: { role: UserRole }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <GridBackground />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4">
        <TopBar role={role} />

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <SideNav role={role} />

          <section className="space-y-4">
            <GlassPanel className="space-y-4">
              <SectionHeading
                eyebrow="PHARMACO CONTROL CENTER"
                title="Dashboard base premium"
                description="Vista administrativa inicial, diseñada para crecer por módulos sin perder consistencia visual ni rendimiento."
              />
              <div className="flex flex-wrap gap-2">
                <StatusChip tone="success">Sesión activa</StatusChip>
                <StatusChip tone="info">Responsive</StatusChip>
                <StatusChip>Escalable</StatusChip>
              </div>
            </GlassPanel>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Ventas del día" value="$12,480" delta="+8.2% vs ayer" />
              <SummaryCard label="Tickets POS" value="248" delta="+5.4% vs ayer" />
              <SummaryCard label="Stock crítico" value="17" delta="-2.1% esta semana" />
              <SummaryCard label="Tareas activas" value="31" delta="+12% hoy" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {moduleCatalog.map((module) => (
                <ModuleCard
                  key={module.title}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  status={module.status}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

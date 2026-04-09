import { Building2, ShieldCheck, Stethoscope } from "lucide-react";

import { GridBackground } from "@/components/ui/grid-background";
import { SectionHeading } from "@/components/ui/section-heading";
import { SideNav } from "@/components/layout/side-nav";
import { StatCard } from "@/components/ui/stat-card";
import { TopBar } from "@/components/layout/topbar";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusChip } from "@/components/ui/status-chip";

export function AppShell() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <GridBackground />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4">
        <TopBar />

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <SideNav />

          <section className="space-y-4">
            <GlassPanel className="space-y-4">
              <SectionHeading
                eyebrow="PHARMACO PLATFORM"
                title="Base visual y estructural lista para escalar"
                description="Sistema administrativo farmacéutico con estética SaaS premium, identidad tecnológica y una arquitectura limpia para próximas fases funcionales."
              />
              <div className="flex flex-wrap gap-2">
                <StatusChip tone="success">Diseño corporativo</StatusChip>
                <StatusChip tone="info">Glassmorphism ligero</StatusChip>
                <StatusChip>Modo oscuro elegante</StatusChip>
              </div>
            </GlassPanel>

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Escalabilidad" value="Alta" hint="Route groups + UI reusable + dominios separados." />
              <StatCard label="Consistencia visual" value="Premium" hint="Tokens de color, blur, bordes y sombras uniformes." />
              <StatCard label="Preparación enterprise" value="Fase 1" hint="Base de navegación, paneles y módulos iniciales." />
            </div>

            <GlassPanel className="grid gap-3 md:grid-cols-3">
              <article className="space-y-2 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                <h3 className="text-sm font-semibold text-slate-100">Gobernanza</h3>
                <p className="text-xs text-slate-300/90">Sección diseñada para políticas, permisos y seguridad operacional.</p>
              </article>
              <article className="space-y-2 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <Stethoscope className="h-5 w-5 text-cyan-300" />
                <h3 className="text-sm font-semibold text-slate-100">Operación farmacéutica</h3>
                <p className="text-xs text-slate-300/90">Espacios preparados para trazabilidad, inventario y control sanitario.</p>
              </article>
              <article className="space-y-2 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <Building2 className="h-5 w-5 text-cyan-300" />
                <h3 className="text-sm font-semibold text-slate-100">Escenario corporativo</h3>
                <p className="text-xs text-slate-300/90">Base visual consistente para módulos administrativos multi-área.</p>
              </article>
            </GlassPanel>
          </section>
        </div>
      </div>
    </main>
  );
}

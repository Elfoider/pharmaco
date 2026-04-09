import { Building2, ShieldCheck, Stethoscope } from "lucide-react";

import { GridBackground } from "@/components/ui/grid-background";
import { SectionHeading } from "@/components/ui/section-heading";
import { SideNav } from "@/components/layout/side-nav";
import { StatCard } from "@/components/ui/stat-card";
import { TopBar } from "@/components/layout/topbar";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusChip } from "@/components/ui/status-chip";
import type { UserRole } from "@/lib/auth/roles";

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
                eyebrow="PHARMACO DASHBOARD"
                title="Base protegida por sesión y rol"
                description="El acceso y la navegación se ajustan según el rol autenticado del usuario."
              />
              <div className="flex flex-wrap gap-2">
                <StatusChip tone="success">Sesión activa</StatusChip>
                <StatusChip tone="info">Ruta protegida</StatusChip>
                <StatusChip>RBAC activo</StatusChip>
              </div>
            </GlassPanel>

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Rol actual" value={role} hint="Menú lateral filtrado por permisos." />
              <StatCard label="Estado de sesión" value="Activa" hint="Si falta cookie, redirige al login." />
              <StatCard label="Protección" value="Habilitada" hint="Guardas por ruta en proxy y layout." />
            </div>

            <GlassPanel className="grid gap-3 md:grid-cols-3">
              <article className="space-y-2 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                <h3 className="text-sm font-semibold text-slate-100">Control de acceso</h3>
                <p className="text-xs text-slate-300/90">Rutas privadas con validación de rol permitido.</p>
              </article>
              <article className="space-y-2 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <Stethoscope className="h-5 w-5 text-cyan-300" />
                <h3 className="text-sm font-semibold text-slate-100">Operación farmacéutica</h3>
                <p className="text-xs text-slate-300/90">Estructura lista para flujos farmacéuticos por área.</p>
              </article>
              <article className="space-y-2 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <Building2 className="h-5 w-5 text-cyan-300" />
                <h3 className="text-sm font-semibold text-slate-100">Escalabilidad</h3>
                <p className="text-xs text-slate-300/90">Arquitectura preparada para módulos enterprise.</p>
              </article>
            </GlassPanel>
          </section>
        </div>
      </div>
    </main>
  );
}

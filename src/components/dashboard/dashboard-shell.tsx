"use client";

import { ClipboardList, Package, Shield, Users, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

import type { UserRole } from "@/lib/auth/roles";
import { clearClientSession } from "@/lib/auth/session";
import { PharmacoLogo } from "@/components/branding/pharmaco-logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const modules = [
  { name: "Inventario", icon: Package, status: "Base" },
  { name: "Caja y Facturación", icon: Wallet, status: "Base" },
  { name: "Recursos Humanos", icon: Users, status: "Base" },
  { name: "Trazabilidad", icon: ClipboardList, status: "Base" },
];

export function DashboardShell({ role }: { role: UserRole }) {
  const router = useRouter();

  function handleSignOut() {
    clearClientSession();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <PharmacoLogo />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Panel administrativo</p>
              <h1 className="text-2xl font-semibold">Bienvenido, rol: {role}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
              <Shield className="h-3.5 w-3.5" /> Acceso protegido
            </span>
            <Button type="button" className="h-10 px-4" onClick={handleSignOut}>
              Cerrar sesión
            </Button>
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Card key={module.name} className="space-y-3">
                <Icon className="h-5 w-5 text-cyan-300" />
                <h2 className="text-base font-medium">{module.name}</h2>
                <p className="text-sm text-slate-400">Módulo inicial listo para crecer en próximas fases.</p>
                <span className="inline-flex rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300">
                  {module.status}
                </span>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}

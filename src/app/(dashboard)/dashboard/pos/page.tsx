import { EmptyState } from "@/components/data/empty-state";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";

export default function PosPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="POS"
          subtitle="Base de punto de venta preparada: catálogo, cliente, stock y reglas comerciales."
          badge="Próxima fase"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <ModuleStat label="Cajas activas" value="3" />
          <ModuleStat label="Sesiones abiertas" value="2" />
          <ModuleStat label="Ventas mock hoy" value="248" />
          <ModuleStat label="Ticket promedio" value="$51.2" />
        </div>

        <EmptyState
          title="POS en construcción"
          description="La arquitectura base ya está lista: módulos de clientes, empleados, productos e inventario se conectarán aquí en la siguiente fase sin romper la estructura." 
        />
      </div>
    </main>
  );
}

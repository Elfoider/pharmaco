import { DataTable } from "@/components/data/data-table";
import { EmptyState } from "@/components/data/empty-state";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";

const rows = [
  ["CLI-001", "María Torres", "persona", "Activa"],
  ["CLI-002", "Farmacia Central Norte", "empresa", "Activa"],
  ["CLI-003", "Jorge Peña", "persona", "Inactiva"],
];

export default function ClientesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="Clientes"
          subtitle="Base para gestión de pacientes/clientes y segmentación comercial para POS."
          badge="Módulo inicial"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ModuleStat label="Clientes totales" value="1,248" />
          <ModuleStat label="Empresas" value="96" />
          <ModuleStat label="Pendientes actualización" value="34" />
        </div>

        <DataTable columns={["Código", "Nombre", "Tipo", "Estado"]} rows={rows} />

        <EmptyState
          title="Próximamente: perfiles enriquecidos"
          description="Aquí se integrarán historial de compras, preferencias, segmentación y métricas para POS sin datos clínicos sensibles." 
        />
      </div>
    </main>
  );
}

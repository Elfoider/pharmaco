import { DataTable } from "@/components/data/data-table";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";

const rows = [
  ["EMP-001", "Ana Ruiz", "Farmacéutico", "Activo"],
  ["EMP-002", "Luis Gómez", "Cajero", "Activo"],
  ["EMP-003", "Diana Herrera", "RRHH", "Activo"],
];

export default function EmpleadosPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="Empleados"
          subtitle="Estructura base para colaboradores, roles operativos y control organizacional."
          badge="Módulo inicial"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ModuleStat label="Colaboradores" value="42" />
          <ModuleStat label="En turno" value="18" />
          <ModuleStat label="Áreas activas" value="6" />
        </div>

        <DataTable columns={["Código", "Nombre", "Cargo", "Estado"]} rows={rows} />
      </div>
    </main>
  );
}

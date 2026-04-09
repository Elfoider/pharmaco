import { DataTable } from "@/components/data/data-table";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";

const rows = [
  ["PRD-1001", "Paracetamol 500mg", "Lote L-001", "120 u."],
  ["PRD-1208", "Guantes nitrilo", "Lote L-114", "40 cajas"],
  ["PRD-3401", "Alcohol 70%", "Lote L-220", "92 u."],
];

export default function InventarioPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="Inventario"
          subtitle="Base para productos, lotes, trazabilidad de movimientos y preparación del POS."
          badge="Módulo crítico"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <ModuleStat label="SKU activos" value="1,932" />
          <ModuleStat label="Lotes activos" value="604" />
          <ModuleStat label="Stock crítico" value="17" />
          <ModuleStat label="Movimientos hoy" value="83" />
        </div>

        <DataTable columns={["SKU", "Producto", "Lote", "Stock"]} rows={rows} />
      </div>
    </main>
  );
}

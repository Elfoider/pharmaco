import Link from "next/link";

import { ModuleHeader } from "@/components/data/module-header";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function PosReturnsPlaceholderPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <ModuleHeader
          title="Devoluciones POS"
          subtitle="Vista placeholder para la fase de devoluciones parciales/totales con reintegro de inventario."
          badge="Próxima fase"
        />

        <GlassPanel className="space-y-4 p-5">
          <h2 className="text-lg font-semibold text-cyan-100">Preparación lista</h2>
          <ul className="space-y-2 text-sm text-slate-200">
            <li>• Referencias entre venta, ítems de venta y futuras devoluciones.</li>
            <li>• Campos de estado para devolución parcial / total.</li>
            <li>• Estructura para registrar reintegro de inventario por ítem.</li>
          </ul>

          <p className="text-xs text-slate-400">
            Aquí se implementará en la siguiente fase el flujo completo de búsqueda de ticket, selección de líneas y
            confirmación de reintegro.
          </p>

          <Link
            href="/dashboard/pos"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/20 px-4 text-sm font-medium text-slate-100 hover:bg-white/10"
          >
            Volver a POS
          </Link>
        </GlassPanel>
      </div>
    </main>
  );
}

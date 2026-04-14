import type { InventoryMovement } from "@/modules/inventory/types";

type InventoryMovementsTableProps = {
  movements: InventoryMovement[];
};

export function InventoryMovementsTable({ movements }: InventoryMovementsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">Lote</th>
            <th className="px-4 py-3 font-medium">Cantidad</th>
            <th className="px-4 py-3 font-medium">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
              <td className="px-4 py-3">{movement.createdAt ? new Date(movement.createdAt).toLocaleString() : "-"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                    movement.type === "entrada"
                      ? "border-emerald-300/35 bg-emerald-400/15 text-emerald-100"
                      : movement.type === "salida"
                        ? "border-rose-300/35 bg-rose-400/15 text-rose-100"
                        : "border-amber-300/35 bg-amber-400/15 text-amber-100"
                  }`}
                >
                  {movement.type}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{movement.productId}</td>
              <td className="px-4 py-3 font-mono text-xs">{movement.batchId}</td>
              <td className="px-4 py-3">{movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}</td>
              <td className="px-4 py-3">{movement.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { Batch } from "@/modules/inventory/types";

type InventoryProductViewProps = {
  batches: Batch[];
};

function getRemainingDays(expiryDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(expiryDate);
  date.setHours(0, 0, 0, 0);

  return Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function InventoryProductView({ batches }: InventoryProductViewProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">Lote</th>
            <th className="px-4 py-3 font-medium">Vence</th>
            <th className="px-4 py-3 font-medium">Días</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Sucursal</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => {
            const remainingDays = getRemainingDays(batch.expiryDate);
            const isNearExpiry = remainingDays <= 45;
            const isExpired = remainingDays < 0;

            return (
              <tr key={batch.id} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
                <td className="px-4 py-3 font-mono text-xs">{batch.productId}</td>
                <td className="px-4 py-3 font-medium">{batch.lotNumber}</td>
                <td className="px-4 py-3">{batch.expiryDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                      isExpired
                        ? "border-rose-300/35 bg-rose-400/15 text-rose-100"
                        : isNearExpiry
                          ? "border-amber-300/35 bg-amber-400/15 text-amber-100"
                          : "border-emerald-300/35 bg-emerald-400/15 text-emerald-100"
                    }`}
                  >
                    {isExpired ? "Vencido" : `${remainingDays} días`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${batch.stock <= 10 ? "text-amber-200" : "text-cyan-100"}`}>
                    {batch.stock}
                  </span>
                </td>
                <td className="px-4 py-3">{batch.branchId}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

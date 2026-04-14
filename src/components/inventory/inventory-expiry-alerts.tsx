import { AlertTriangle } from "lucide-react";

import type { Batch } from "@/modules/inventory/types";

type InventoryExpiryAlertsProps = {
  batches: Batch[];
};

function getRemainingDays(expiryDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(expiryDate);
  date.setHours(0, 0, 0, 0);

  return Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function InventoryExpiryAlerts({ batches }: InventoryExpiryAlertsProps) {
  if (!batches.length) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-2xl border border-amber-300/30 bg-amber-500/10 p-3">
      <div className="flex items-center gap-2 text-amber-100">
        <AlertTriangle className="h-4 w-4" />
        <p className="text-sm font-semibold uppercase tracking-[0.16em]">Alertas de vencimiento</p>
      </div>

      <ul className="space-y-1 text-sm text-amber-50">
        {batches.map((batch) => {
          const days = getRemainingDays(batch.expiryDate);
          return (
            <li key={batch.id}>
              Lote <span className="font-semibold">{batch.lotNumber}</span> ({batch.productId}) vence en {days} días - stock {batch.stock}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { AlertTriangle, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePos } from "@/components/pos/pos-provider";

export function SaleSummary() {
  const { subtotal, itemCount, selectedCustomer } = usePos();

  return (
    <aside className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
      <div className="mb-3 flex items-center gap-2">
        <Wallet className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Resumen / Cierre</h2>
      </div>

      <div className="space-y-2 text-sm text-slate-200">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Cliente</span>
          <span className="text-xs">{selectedCustomer ? selectedCustomer.name : "Sin cliente"}</span>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100">Subtotal estimado</p>
        <p className="text-2xl font-semibold text-cyan-50">${subtotal.toFixed(2)}</p>
      </div>

      <div className="mt-3 rounded-xl border border-amber-300/30 bg-amber-400/10 p-3 text-amber-100">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em]">
          <AlertTriangle className="h-3.5 w-3.5" /> Modo base
        </p>
        <p className="mt-1 text-xs text-amber-50">El cierre real de venta e impacto en inventario están deshabilitados en esta fase.</p>
      </div>

      <Button type="button" className="mt-3 h-10 w-full" disabled>
        Finalizar venta (próxima fase)
      </Button>
    </aside>
  );
}

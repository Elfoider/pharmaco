"use client";

import { AlertTriangle, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePos } from "@/components/pos/pos-provider";

export function SaleSummary() {
  const {
    state,
    subtotal,
    discountedSubtotal,
    taxAmount,
    finalTotal,
    itemCount,
    selectedCustomer,
    hasValidationErrors,
    validationMessages,
    isClosingSale,
    closeSaleError,
    finalizeSale,
    dispatch,
  } = usePos();

  const hasProducts = itemCount > 0;

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

      <div className="mt-3 space-y-2 rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-cyan-100">Subtotal</span>
          <span className="font-medium text-cyan-50">${subtotal.toFixed(2)}</span>
        </div>

        <label className="block text-[11px] uppercase tracking-[0.16em] text-cyan-100">
          Descuento manual
          <input
            type="number"
            min={0}
            step="0.01"
            value={state.manualDiscount}
            onChange={(event) => dispatch({ type: "set-discount", payload: Number(event.target.value) })}
            disabled={!hasProducts}
            className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-slate-950/65 px-2 text-sm text-slate-50 outline-none focus:border-cyan-300/80 disabled:opacity-60"
          />
        </label>

        <label className="block text-[11px] uppercase tracking-[0.16em] text-cyan-100">
          Impuesto (%)
          <input
            type="number"
            min={0}
            step="0.01"
            value={state.taxPercent}
            onChange={(event) => dispatch({ type: "set-tax-percent", payload: Number(event.target.value) })}
            disabled={!hasProducts}
            className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-slate-950/65 px-2 text-sm text-slate-50 outline-none focus:border-cyan-300/80 disabled:opacity-60"
          />
        </label>

        <label className="block text-[11px] uppercase tracking-[0.16em] text-cyan-100">
          Método de pago
          <select
            value={state.paymentMethod}
            onChange={(event) =>
              dispatch({
                type: "set-payment-method",
                payload: event.target.value as "cash" | "card" | "transfer" | "mixed",
              })
            }
            disabled={!hasProducts}
            className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-slate-950/65 px-2 text-sm text-slate-50 outline-none focus:border-cyan-300/80 disabled:opacity-60"
          >
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="mixed">Mixto (preparado)</option>
          </select>
        </label>

        <div className="flex items-center justify-between text-sm text-cyan-50/90">
          <span>Subtotal con descuento</span>
          <span>${discountedSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-cyan-50/90">
          <span>Impuesto</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-2 text-base font-semibold text-cyan-50">
          <span>Total final</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {hasValidationErrors ? (
        <div className="mt-3 rounded-xl border border-amber-300/30 bg-amber-400/10 p-3 text-amber-100">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em]">
            <AlertTriangle className="h-3.5 w-3.5" /> Validaciones previas
          </p>
          <ul className="mt-1 space-y-1 text-xs text-amber-50">
            {validationMessages.map((message) => (
              <li key={message}>• {message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {closeSaleError ? (
        <div className="mt-3 rounded-xl border border-rose-300/30 bg-rose-400/10 p-3 text-xs text-rose-100">
          {closeSaleError}
        </div>
      ) : null}

      <Button
        type="button"
        className="mt-3 h-10 w-full"
        disabled={!hasProducts || hasValidationErrors || isClosingSale}
        onClick={() => {
          void finalizeSale();
        }}
      >
        {isClosingSale ? "Procesando venta..." : "Finalizar venta"}
      </Button>
    </aside>
  );
}

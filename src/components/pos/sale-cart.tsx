"use client";

import { AlertTriangle, Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePos } from "@/components/pos/pos-provider";

function getDaysUntil(dateValue: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function SaleCart() {
  const { state, dispatch, subtotal, batches, isLoadingBatches } = usePos();

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Carrito</h2>
        <span className="text-xs text-slate-400">{state.cart.length} líneas</span>
      </div>

      <div className="space-y-2">
        {state.cart.length ? (
          state.cart.map((line) => {
            const productBatches = batches
              .filter((batch) => batch.productId === line.product.id)
              .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));

            const firstValidBatch = productBatches.find((batch) => {
              const days = getDaysUntil(batch.expiryDate);
              return batch.stock > 0 && days >= 0;
            });

            const manualBatch = productBatches.find((batch) => batch.id === line.selectedBatchId);
            const selectedBatchForPreview = line.batchMode === "manual" ? manualBatch : firstValidBatch;

            return (
              <div
                key={line.product.id}
                className={`rounded-xl border bg-white/[0.02] p-2 transition ${
                  state.lastChangedProductId === line.product.id
                    ? "border-cyan-300/45 shadow-[0_0_0_1px_rgba(103,232,249,0.25)]"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{line.product.name}</p>
                    <p className="text-xs text-slate-400">${line.product.price.toFixed(2)} c/u</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "remove", payload: line.product.id })}
                    className="text-slate-400 hover:text-rose-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      className="h-7 w-7 px-0"
                      onClick={() => dispatch({ type: "decrement", payload: line.product.id })}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <Button
                      type="button"
                      className="h-7 w-7 px-0"
                      onClick={() => dispatch({ type: "increment", payload: line.product.id })}
                      disabled={line.quantity >= line.product.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-cyan-100">${(line.product.price * line.quantity).toFixed(2)}</span>
                </div>

                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <span>Control lote:</span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "set-batch-mode",
                          payload: { productId: line.product.id, mode: line.batchMode === "auto" ? "manual" : "auto" },
                        })
                      }
                      className="rounded-md border border-white/15 px-2 py-1 text-[10px] text-slate-300 hover:border-cyan-300/40"
                    >
                      {line.batchMode === "auto" ? "FIFO automático" : "Manual"}
                    </button>
                  </div>

                  {line.batchMode === "manual" ? (
                    <select
                      value={line.selectedBatchId ?? ""}
                      onChange={(event) =>
                        dispatch({ type: "set-batch-id", payload: { productId: line.product.id, batchId: event.target.value } })
                      }
                      className="h-9 w-full rounded-lg border border-white/15 bg-slate-950/65 px-2 text-xs text-slate-100 outline-none focus:border-cyan-300/80"
                    >
                      <option value="">Seleccionar lote</option>
                      {productBatches.map((batch) => {
                        const days = getDaysUntil(batch.expiryDate);
                        const isExpired = days < 0;
                        return (
                          <option key={batch.id} value={batch.id} disabled={isExpired || batch.stock <= 0}>
                            {batch.lotNumber} · vence {batch.expiryDate} · stock {batch.stock}
                            {isExpired ? " · VENCIDO" : ""}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <p className="text-xs text-slate-300">
                      {isLoadingBatches
                        ? "Calculando FIFO..."
                        : selectedBatchForPreview
                          ? `FIFO sugerido: ${selectedBatchForPreview.lotNumber} (vence ${selectedBatchForPreview.expiryDate}, stock ${selectedBatchForPreview.stock})`
                          : "No hay lotes disponibles para este producto."}
                    </p>
                  )}

                  {selectedBatchForPreview ? (
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2 text-xs text-slate-300">
                      <p>
                        Lote: <span className="font-medium text-slate-100">{selectedBatchForPreview.lotNumber}</span> · Vence:
                        <span className="font-medium text-slate-100"> {selectedBatchForPreview.expiryDate}</span> · Stock: {selectedBatchForPreview.stock}
                      </p>
                      {getDaysUntil(selectedBatchForPreview.expiryDate) <= 30 ? (
                        <p className="mt-1 inline-flex items-center gap-1 text-amber-200">
                          <AlertTriangle className="h-3.5 w-3.5" /> Lote próximo a vencer
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <label className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Cantidad
                    <input
                      type="number"
                      min={1}
                      max={line.product.stock}
                      value={line.quantity}
                      onChange={(event) =>
                        dispatch({
                          type: "set-quantity",
                          payload: { productId: line.product.id, quantity: Number(event.target.value) },
                        })
                      }
                      className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-slate-950/65 px-2 text-sm text-slate-100 outline-none focus:border-cyan-300/80"
                    />
                  </label>
                  <label className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Observación (opcional)
                    <input
                      value={line.note ?? ""}
                      onChange={(event) =>
                        dispatch({
                          type: "set-note",
                          payload: { productId: line.product.id, note: event.target.value },
                        })
                      }
                      placeholder="Ej: fraccionado / preferencia del cliente"
                      className="mt-1 h-9 w-full rounded-lg border border-white/15 bg-slate-950/65 px-2 text-sm text-slate-100 outline-none focus:border-cyan-300/80"
                    />
                  </label>
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-xl border border-dashed border-white/15 p-3 text-sm text-slate-400">
            Agrega productos para iniciar una venta.
          </p>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100">Total acumulado</p>
        <p className="text-xl font-semibold text-cyan-50">${subtotal.toFixed(2)}</p>
      </div>
    </div>
  );
}

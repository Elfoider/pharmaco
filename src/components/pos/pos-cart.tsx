import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/modules/products/types";

export type CartLine = {
  product: Product;
  quantity: number;
};

type PosCartProps = {
  lines: CartLine[];
  paymentMethodLabel: string;
  isClosing: boolean;
  hasStockIssues: boolean;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onFinalizeSale: () => void;
};

export function PosCart({
  lines,
  paymentMethodLabel,
  isClosing,
  hasStockIssues,
  onIncrement,
  onDecrement,
  onRemove,
  onFinalizeSale,
}: PosCartProps) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.salePrice * line.quantity, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Carrito</h2>
        <span className="text-xs text-slate-400">{lines.length} items</span>
      </div>

      <div className="space-y-2">
        {lines.length ? (
          lines.map((line) => (
            <div key={line.product.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-100">{line.product.name}</p>
                  <p className="text-xs text-slate-400">${line.product.salePrice.toFixed(2)} c/u</p>
                </div>
                <button type="button" onClick={() => onRemove(line.product.id)} className="text-slate-400 hover:text-rose-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button type="button" className="h-7 w-7 px-0" onClick={() => onDecrement(line.product.id)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{line.quantity}</span>
                  <Button type="button" className="h-7 w-7 px-0" onClick={() => onIncrement(line.product.id)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="font-semibold text-cyan-100">${(line.product.salePrice * line.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-white/15 p-3 text-sm text-slate-400">Busca y agrega productos para iniciar la venta.</p>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200">Método: {paymentMethodLabel}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100">Subtotal</p>
        <p className="text-xl font-semibold text-cyan-50">${subtotal.toFixed(2)}</p>
      </div>

      <Button
        type="button"
        className="mt-3 h-10 w-full"
        disabled={!lines.length || isClosing || hasStockIssues}
        onClick={onFinalizeSale}
      >
        {isClosing ? "Procesando..." : "Finalizar venta"}
      </Button>
    </div>
  );
}

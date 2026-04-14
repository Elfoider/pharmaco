"use client";

import { CheckCircle2, Printer, ReceiptText, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { usePos } from "@/components/pos/pos-provider";

function paymentMethodLabel(method: "cash" | "card" | "transfer" | "mixed") {
  const labels = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia",
    mixed: "Pago mixto",
  } as const;

  return labels[method];
}

export function SaleSuccessModal() {
  const { isSuccessModalOpen, lastCompletedSale, closeSuccessModal } = usePos();
  const [showDetail, setShowDetail] = useState(false);

  if (!isSuccessModalOpen || !lastCompletedSale) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-md [animation:pharmaco-fade-in_220ms_ease-out]">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-200/30 bg-slate-900/95 shadow-[0_20px_80px_rgba(6,182,212,0.28)] [animation:pharmaco-scale-in_320ms_cubic-bezier(0.22,1,0.36,1)]">
        <div className="pointer-events-none absolute -left-20 -top-24 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative space-y-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                <Sparkles className="h-3.5 w-3.5" /> Operación completada
              </p>
              <h3 className="text-2xl font-semibold text-white">Venta completada con éxito</h3>
              <p className="text-sm text-slate-300">
                Comprobante <span className="font-medium text-cyan-200">{lastCompletedSale.saleNumber}</span>
              </p>
            </div>
            <CheckCircle2 className="h-9 w-9 text-emerald-300" />
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total de la venta</p>
              <p className="mt-1 text-xl font-semibold text-cyan-100">${lastCompletedSale.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Método de pago</p>
              <p className="mt-1 font-medium text-slate-100">{paymentMethodLabel(lastCompletedSale.paymentMethod)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Cliente</p>
              <p className="mt-1 font-medium text-slate-100">{lastCompletedSale.customerName ?? "Consumidor final"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Productos</p>
              <p className="mt-1 font-medium text-slate-100">
                {lastCompletedSale.productCount} tipos / {lastCompletedSale.itemCount} unidades
              </p>
            </div>
          </div>

          {showDetail ? (
            <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3 text-xs text-cyan-100">
              Detalle rápido: venta registrada en el sistema con ID interno{" "}
              <span className="font-semibold text-cyan-50">{lastCompletedSale.saleId}</span>.
            </div>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Button type="button" onClick={closeSuccessModal} className="h-10">
              <RotateCcw className="mr-2 h-4 w-4" />
              Nueva venta
            </Button>
            <Button
              type="button"
              onClick={() => setShowDetail((prev) => !prev)}
              className="h-10 bg-slate-800 text-slate-100 shadow-none hover:bg-slate-700"
            >
              <ReceiptText className="mr-2 h-4 w-4" />
              Ver detalle
            </Button>
            <Button
              type="button"
              className="h-10 border border-white/20 bg-transparent text-slate-200 shadow-none hover:bg-white/10"
              disabled
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir ticket
            </Button>
            <Link href="/dashboard/pos/devoluciones" className="block">
              <Button
                type="button"
                className="h-10 w-full border border-cyan-300/35 bg-cyan-500/15 text-cyan-100 shadow-none hover:bg-cyan-500/25"
              >
                Devoluciones
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Loader2, UserRound, UserX, X } from "lucide-react";

import { usePos } from "@/components/pos/pos-provider";

export function CustomerSelector() {
  const { filteredCustomers, selectedCustomer, state, isLoadingCustomers, dispatch } = usePos();

  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
          <UserRound className="h-3.5 w-3.5 text-cyan-300" /> Cliente
        </label>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "set-customer", payload: "none" });
            dispatch({ type: "set-customer-search", payload: "" });
          }}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[11px] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100"
        >
          <UserX className="h-3 w-3" /> Sin cliente
        </button>
      </div>

      <input
        value={state.customerSearch}
        onChange={(event) => dispatch({ type: "set-customer-search", payload: event.target.value })}
        placeholder="Buscar cliente por nombre, documento o teléfono"
        className="h-9 w-full rounded-lg border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80"
      />

      {selectedCustomer ? (
        <div className="flex items-center justify-between rounded-lg border border-cyan-300/35 bg-cyan-400/10 px-2.5 py-2">
          <div>
            <p className="text-sm font-medium text-cyan-100">{selectedCustomer.name}</p>
            <p className="text-[11px] text-cyan-200/80">
              {selectedCustomer.document} · {selectedCustomer.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "set-customer", payload: "none" })}
            className="rounded-md border border-cyan-300/35 p-1.5 text-cyan-100 hover:bg-cyan-400/20"
            aria-label="Quitar cliente"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <div className="max-h-36 space-y-1 overflow-y-auto pr-1">
        {isLoadingCustomers ? (
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando clientes...
          </p>
        ) : filteredCustomers.length ? (
          filteredCustomers.slice(0, 8).map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => dispatch({ type: "set-customer", payload: customer.id })}
              className={`w-full rounded-lg border px-2.5 py-2 text-left transition ${
                state.selectedCustomerId === customer.id
                  ? "border-cyan-300/45 bg-cyan-400/15"
                  : "border-white/10 bg-white/[0.01] hover:border-cyan-300/35 hover:bg-cyan-400/10"
              }`}
            >
              <p className="text-sm text-slate-100">{customer.name}</p>
              <p className="text-[11px] text-slate-400">
                {customer.document} · {customer.phone}
              </p>
            </button>
          ))
        ) : (
          <p className="text-xs text-slate-400">Sin clientes que coincidan.</p>
        )}
      </div>

      <button
        type="button"
        disabled
        className="h-8 w-full rounded-lg border border-dashed border-white/20 text-xs text-slate-400 disabled:opacity-70"
      >
        + Crear cliente rápido (próxima fase)
      </button>
    </div>
  );
}

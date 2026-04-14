"use client";

import { UserRound } from "lucide-react";

import { usePos } from "@/components/pos/pos-provider";

export function CustomerSelector() {
  const { customers, selectedCustomer, state, dispatch } = usePos();

  return (
    <div className="flex items-center gap-2">
      <UserRound className="h-4 w-4 text-slate-400" />
      <select
        value={state.selectedCustomerId}
        onChange={(event) => dispatch({ type: "set-customer", payload: event.target.value })}
        className="h-9 rounded-lg border border-white/15 bg-slate-950/65 px-3 text-xs text-slate-100 outline-none transition focus:border-cyan-300/80"
      >
        <option value="none">Sin cliente</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.document})
          </option>
        ))}
      </select>
      {selectedCustomer ? <p className="text-xs text-cyan-200">Cliente: {selectedCustomer.name}</p> : null}
    </div>
  );
}

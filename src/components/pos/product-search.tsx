"use client";

import { Search } from "lucide-react";

import { usePos } from "@/components/pos/pos-provider";

export function ProductSearch() {
  const { state, dispatch } = usePos();

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <input
        value={state.search}
        onChange={(event) => dispatch({ type: "set-search", payload: event.target.value })}
        placeholder="Buscar por nombre, genérico, SKU o código de barras"
        className="h-10 w-full rounded-xl border border-white/15 bg-slate-950/65 pl-9 pr-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
      />
    </div>
  );
}

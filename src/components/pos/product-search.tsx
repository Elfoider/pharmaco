"use client";

import { Search } from "lucide-react";

import { usePos } from "@/components/pos/pos-provider";

export function ProductSearch() {
  const { state, dispatch } = usePos();

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-cyan-300/80" />
      <input
        value={state.search}
        onChange={(event) => dispatch({ type: "set-search", payload: event.target.value })}
        placeholder="Buscar por nombre, genérico, SKU o código de barras"
        className="h-14 w-full rounded-2xl border border-cyan-300/25 bg-slate-950/70 pl-12 pr-4 text-base text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
      />
    </div>
  );
}

"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProductsToolbarProps = {
  search: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onCreateClick: () => void;
};

export function ProductsToolbar({
  search,
  categoryFilter,
  onSearchChange,
  onCategoryFilterChange,
  onCreateClick,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre, genérico, SKU o barcode"
            className="h-11 w-full rounded-xl border border-white/15 bg-slate-950/65 pl-9 pr-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
          />
        </div>

        <Button type="button" className="h-11 px-4" onClick={onCreateClick}>
          <Plus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Categoría:</span>
        <input
          value={categoryFilter === "all" ? "" : categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value || "all")}
          placeholder="Filtrar por categoría"
          className="h-9 rounded-lg border border-white/15 bg-slate-950/65 px-3 text-xs text-slate-100 outline-none transition focus:border-cyan-300/80"
        />
      </div>
    </div>
  );
}

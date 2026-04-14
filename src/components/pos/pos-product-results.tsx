import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/modules/products/types";

type PosProductResultsProps = {
  products: Product[];
  onAdd: (product: Product) => void;
};

export function PosProductResults({ products, onAdd }: PosProductResultsProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Acción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
              <td className="px-4 py-3">
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-slate-400">{product.genericName}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
              <td className="px-4 py-3">${product.salePrice.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={product.stock <= 10 ? "text-amber-200" : "text-cyan-100"}>{product.stock}</span>
              </td>
              <td className="px-4 py-3">
                <Button type="button" className="h-8 px-3 text-xs" onClick={() => onAdd(product)}>
                  <Plus className="h-3.5 w-3.5" /> Agregar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

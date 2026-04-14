"use client";

import { Plus } from "lucide-react";

import { EmptyState } from "@/components/data/empty-state";
import { ControlledBadge, PrescriptionBadge } from "@/components/products/product-badges";
import { Button } from "@/components/ui/button";
import { usePos } from "@/components/pos/pos-provider";

export function ProductResults() {
  const { filteredProducts, isLoadingProducts, dispatch } = usePos();

  if (isLoadingProducts) {
    return <EmptyState title="Cargando productos" description="Sincronizando catálogo POS..." />;
  }

  if (!filteredProducts.length) {
    return (
      <EmptyState
        title="Sin resultados"
        description="No encontramos productos para esa búsqueda. Prueba por nombre, barcode o SKU."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">Flags</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
              <td className="px-4 py-3">
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-slate-400">{product.genericName}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <PrescriptionBadge enabled={product.requiresPrescription} />
                  <ControlledBadge enabled={product.controlled} />
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
              <td className="px-4 py-3">${product.price.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={product.stock <= 0 ? "text-rose-200" : product.stock <= 10 ? "text-amber-200" : "text-cyan-100"}>
                  {product.stock <= 0 ? "Sin stock" : product.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <Button
                  type="button"
                  className="h-8 px-3 text-xs"
                  disabled={product.stock <= 0}
                  onClick={() => dispatch({ type: "add-product", payload: product })}
                >
                  <Plus className="h-3.5 w-3.5" /> {product.stock <= 0 ? "Sin stock" : "Agregar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

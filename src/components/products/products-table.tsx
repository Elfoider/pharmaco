"use client";

import { Pencil } from "lucide-react";

import type { Product } from "@/modules/products/types";
import { ControlledBadge, PrescriptionBadge } from "@/components/products/product-badges";

type ProductsTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
};

export function ProductsTable({ products, onEdit }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">SKU / Barcode</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 font-medium">Laboratorio</th>
            <th className="px-4 py-3 font-medium">Flags</th>
            <th className="px-4 py-3 font-medium">Precios</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
              <td className="px-4 py-3">
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-slate-400">{product.genericName}</p>
              </td>
              <td className="px-4 py-3">
                <p>{product.sku}</p>
                <p className="text-xs text-slate-400">{product.barcode}</p>
              </td>
              <td className="px-4 py-3">{product.category}</td>
              <td className="px-4 py-3">{product.laboratory}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <PrescriptionBadge enabled={product.requiresPrescription} />
                  <ControlledBadge enabled={product.controlled} />
                </div>
              </td>
              <td className="px-4 py-3">
                <p>Costo: ${product.costPrice.toFixed(2)}</p>
                <p>Venta: ${product.salePrice.toFixed(2)}</p>
              </td>
              <td className="px-4 py-3">{product.stock}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-100 transition hover:border-cyan-300/40 hover:text-cyan-100"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

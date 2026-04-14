"use client";

import { Boxes } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductForm } from "@/components/products/product-form";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsToolbar } from "@/components/products/products-toolbar";
import { EmptyState } from "@/components/data/empty-state";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { Product } from "@/modules/products/types";
import { productsService } from "@/lib/services/products.service";
import type { ProductFormValues } from "@/lib/validations/product";

const mockProducts: Product[] = [
  {
    id: "prd-1",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Paracetamol 500mg",
    genericName: "Acetaminofén",
    barcode: "7701234567891",
    sku: "PRD-1001",
    category: "medicamento",
    laboratory: "Lab Salud",
    requiresPrescription: false,
    controlled: false,
    costPrice: 1.2,
    salePrice: 2.5,
    stock: 120,
    active: true,
  },
];

export function ProductsModule() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function loadProducts(term = "", category = "all") {
    setIsLoading(true);
    try {
      const data = await productsService.search(term, category);
      setProducts(data.length ? data : mockProducts);
    } catch {
      setProducts(mockProducts);
      setFeedback({ kind: "error", message: "No fue posible sincronizar productos desde Firestore." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts(search, categoryFilter);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const controlledCount = useMemo(
    () => products.filter((product) => product.controlled).length,
    [products],
  );

  async function handleCreateOrUpdate(values: ProductFormValues) {
    try {
      if (formMode === "create") {
        await productsService.create(values);
        setFeedback({ kind: "success", message: "Producto creado correctamente." });
      } else if (editingProduct) {
        await productsService.update(editingProduct.id, values);
        setFeedback({ kind: "success", message: "Producto actualizado correctamente." });
      }

      setFormMode("create");
      setEditingProduct(null);
      await loadProducts(search, categoryFilter);
    } catch {
      setFeedback({ kind: "error", message: "No fue posible guardar el producto." });
    }
  }

  function handleStartCreate() {
    setFormMode("create");
    setEditingProduct(null);
  }

  function handleStartEdit(product: Product) {
    setFormMode("edit");
    setEditingProduct(product);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="Products"
          subtitle="Catálogo farmacéutico base con filtros, flags regulatorios y preparación para inventario." 
          badge="Módulo operativo"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ModuleStat label="Productos" value={String(products.length)} />
          <ModuleStat label="Controlados" value={String(controlledCount)} />
          <ModuleStat label="Con récipe" value={String(products.filter((p) => p.requiresPrescription).length)} />
        </div>

        <ProductsToolbar
          search={search}
          categoryFilter={categoryFilter}
          onSearchChange={setSearch}
          onCategoryFilterChange={setCategoryFilter}
          onCreateClick={handleStartCreate}
        />

        {feedback ? (
          <GlassPanel
            className={`border ${feedback.kind === "success" ? "border-emerald-300/30 bg-emerald-400/10" : "border-rose-300/30 bg-rose-400/10"}`}
          >
            <p className={`text-sm ${feedback.kind === "success" ? "text-emerald-100" : "text-rose-100"}`}>
              {feedback.message}
            </p>
          </GlassPanel>
        ) : null}

        <GlassPanel className="space-y-3">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-cyan-300" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Formulario producto</h2>
          </div>
          <ProductForm
            mode={formMode}
            initialProduct={editingProduct}
            onCancel={handleStartCreate}
            onSubmitProduct={handleCreateOrUpdate}
          />
        </GlassPanel>

        {isLoading ? (
          <EmptyState title="Cargando productos" description="Estamos preparando el catálogo de productos..." />
        ) : products.length ? (
          <ProductsTable products={products} onEdit={handleStartEdit} />
        ) : (
          <EmptyState
            title="Sin productos aún"
            description="Presiona 'Nuevo producto' para construir el catálogo base conectado a inventario." 
          />
        )}
      </div>
    </main>
  );
}

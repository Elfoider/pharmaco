"use client";

import { PackagePlus, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { EmptyState } from "@/components/data/empty-state";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";
import { InventoryExpiryAlerts } from "@/components/inventory/inventory-expiry-alerts";
import { InventoryMovementsTable } from "@/components/inventory/inventory-movements-table";
import { InventoryProductView } from "@/components/inventory/inventory-product-view";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { productsService } from "@/lib/services/products.service";
import { inventoryService } from "@/lib/services/inventory.service";
import { inventoryAdjustmentSchema, inventoryEntrySchema } from "@/lib/validations/inventory";
import type { Product } from "@/modules/products/types";
import type { AdjustmentInput, Batch, EntryInput, InventoryMovement } from "@/modules/inventory/types";

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

const mockBatches: Batch[] = [
  {
    id: "batch-1",
    productId: "prd-1",
    lotNumber: "L-001",
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString().slice(0, 10),
    stock: 120,
    branchId: "BR-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockMovements: InventoryMovement[] = [
  {
    id: "mov-1",
    type: "entrada",
    productId: "prd-1",
    batchId: "batch-1",
    quantity: 120,
    reason: "Carga inicial",
    createdAt: new Date().toISOString(),
  },
];

export function InventoryModule() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("all");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [expiring, setExpiring] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const [entryForm, setEntryForm] = useState<EntryInput>({
    productId: "",
    lotNumber: "",
    expiryDate: "",
    quantity: 1,
    branchId: "BR-01",
    reason: "",
  });

  const [adjustmentForm, setAdjustmentForm] = useState<AdjustmentInput>({
    productId: "",
    batchId: "",
    quantity: 0,
    reason: "",
  });

  async function loadData(productId = "all") {
    setIsLoading(true);
    try {
      const [remoteProducts, remoteMovements, remoteBatches, expiringBatches] = await Promise.all([
        productsService.getAll(),
        inventoryService.getMovementHistory(productId),
        inventoryService.getBatchesByProduct(productId),
        inventoryService.getExpiringBatches(45),
      ]);

      setProducts(remoteProducts.length ? remoteProducts : mockProducts);
      setMovements(remoteMovements.length ? remoteMovements : mockMovements);
      setBatches(remoteBatches.length ? remoteBatches : mockBatches);
      setExpiring(expiringBatches.length ? expiringBatches : mockBatches);
    } catch {
      setProducts(mockProducts);
      setMovements(mockMovements);
      setBatches(mockBatches);
      setExpiring(mockBatches);
      setFeedback({ kind: "error", message: "No fue posible sincronizar inventario desde Firestore." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    void loadData(selectedProductId);
  }, [selectedProductId]);

  const totalStock = useMemo(() => batches.reduce((sum, batch) => sum + batch.stock, 0), [batches]);
  const criticalStock = useMemo(() => batches.filter((batch) => batch.stock <= 10).length, [batches]);

  async function handleEntrySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = inventoryEntrySchema.safeParse(entryForm);
    if (!parsed.success) {
      setFeedback({ kind: "error", message: parsed.error.issues[0]?.message ?? "Entrada inválida" });
      return;
    }

    try {
      await inventoryService.entry(parsed.data);
      setFeedback({ kind: "success", message: "Entrada registrada correctamente." });
      setEntryForm({ ...entryForm, lotNumber: "", quantity: 1, reason: "" });
      await loadData(selectedProductId);
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "No fue posible registrar entrada." });
    }
  }

  async function handleAdjustmentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = inventoryAdjustmentSchema.safeParse(adjustmentForm);
    if (!parsed.success) {
      setFeedback({ kind: "error", message: parsed.error.issues[0]?.message ?? "Ajuste inválido" });
      return;
    }

    try {
      await inventoryService.manualAdjust(parsed.data);
      setFeedback({ kind: "success", message: "Ajuste aplicado correctamente." });
      setAdjustmentForm({ ...adjustmentForm, quantity: 0, reason: "" });
      await loadData(selectedProductId);
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "No fue posible aplicar ajuste." });
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="Inventory"
          subtitle="Control crítico por lote con entradas, ajustes manuales e historial preparado para POS." 
          badge="Módulo crítico"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <ModuleStat label="Productos" value={String(products.length)} />
          <ModuleStat label="Lotes activos" value={String(batches.length)} />
          <ModuleStat label="Stock total" value={String(totalStock)} />
          <ModuleStat label="Stock crítico" value={String(criticalStock)} />
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <label className="text-xs uppercase tracking-[0.16em] text-slate-400">Vista por producto:</label>
          <select
            value={selectedProductId}
            onChange={(event) => {
              setSelectedProductId(event.target.value);
              setEntryForm((current) => ({ ...current, productId: event.target.value === "all" ? "" : event.target.value }));
              setAdjustmentForm((current) => ({ ...current, productId: event.target.value === "all" ? "" : event.target.value }));
            }}
            className="h-9 rounded-lg border border-white/15 bg-slate-950/65 px-3 text-xs text-slate-100 outline-none transition focus:border-cyan-300/80"
          >
            <option value="all">Todos</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>

        {feedback ? (
          <GlassPanel
            className={`border ${feedback.kind === "success" ? "border-emerald-300/30 bg-emerald-400/10" : "border-rose-300/30 bg-rose-400/10"}`}
          >
            <p className={`text-sm ${feedback.kind === "success" ? "text-emerald-100" : "text-rose-100"}`}>{feedback.message}</p>
          </GlassPanel>
        ) : null}

        <InventoryExpiryAlerts batches={expiring} />

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassPanel className="space-y-3">
            <div className="flex items-center gap-2">
              <PackagePlus className="h-4 w-4 text-cyan-300" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Entrada de productos</h2>
            </div>

            <form className="grid gap-3" onSubmit={handleEntrySubmit}>
              <input
                value={entryForm.productId}
                onChange={(event) => setEntryForm((current) => ({ ...current, productId: event.target.value }))}
                placeholder="Product ID"
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <input
                value={entryForm.lotNumber}
                onChange={(event) => setEntryForm((current) => ({ ...current, lotNumber: event.target.value }))}
                placeholder="Número de lote"
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <input
                type="date"
                value={entryForm.expiryDate}
                onChange={(event) => setEntryForm((current) => ({ ...current, expiryDate: event.target.value }))}
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={1}
                  value={entryForm.quantity}
                  onChange={(event) => setEntryForm((current) => ({ ...current, quantity: Number(event.target.value) }))}
                  placeholder="Cantidad"
                  className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
                />
                <input
                  value={entryForm.branchId}
                  onChange={(event) => setEntryForm((current) => ({ ...current, branchId: event.target.value }))}
                  placeholder="Sucursal"
                  className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
                />
              </div>
              <input
                value={entryForm.reason}
                onChange={(event) => setEntryForm((current) => ({ ...current, reason: event.target.value }))}
                placeholder="Motivo"
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <Button type="submit" className="h-10">Registrar entrada</Button>
            </form>
          </GlassPanel>

          <GlassPanel className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Ajuste manual</h2>
            </div>

            <form className="grid gap-3" onSubmit={handleAdjustmentSubmit}>
              <input
                value={adjustmentForm.productId}
                onChange={(event) => setAdjustmentForm((current) => ({ ...current, productId: event.target.value }))}
                placeholder="Product ID"
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <input
                value={adjustmentForm.batchId}
                onChange={(event) => setAdjustmentForm((current) => ({ ...current, batchId: event.target.value }))}
                placeholder="Batch ID"
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <input
                type="number"
                value={adjustmentForm.quantity}
                onChange={(event) => setAdjustmentForm((current) => ({ ...current, quantity: Number(event.target.value) }))}
                placeholder="Cantidad (+/-)"
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <input
                value={adjustmentForm.reason}
                onChange={(event) => setAdjustmentForm((current) => ({ ...current, reason: event.target.value }))}
                placeholder="Motivo"
                className="h-10 rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none"
              />
              <Button type="submit" className="h-10">Aplicar ajuste</Button>
            </form>
          </GlassPanel>
        </div>

        {isLoading ? (
          <EmptyState title="Cargando inventario" description="Preparando movimientos y lotes..." />
        ) : (
          <>
            <InventoryProductView batches={batches} />
            <InventoryMovementsTable movements={movements} />
          </>
        )}
      </div>
    </main>
  );
}

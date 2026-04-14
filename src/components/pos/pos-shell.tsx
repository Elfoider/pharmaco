"use client";

import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";
import { CustomerSelector } from "@/components/pos/customer-selector";
import { ProductResults } from "@/components/pos/product-results";
import { ProductSearch } from "@/components/pos/product-search";
import { SaleCart } from "@/components/pos/sale-cart";
import { SaleSuccessModal } from "@/components/pos/sale-success-modal";
import { SaleSummary } from "@/components/pos/sale-summary";
import { usePos } from "@/components/pos/pos-provider";
import { GlassPanel } from "@/components/ui/glass-panel";

export function PosShell() {
  const { filteredProducts, itemCount, subtotal } = usePos();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="POS"
          subtitle="Flujo de caja profesional base en 3 paneles, optimizado para velocidad operativa." 
          badge="Arquitectura base"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <ModuleStat label="Resultados" value={String(filteredProducts.length)} />
          <ModuleStat label="Items venta" value={String(itemCount)} />
          <ModuleStat label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <ModuleStat label="Modo" value="Cierre real activo" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_340px]">
          <section className="space-y-3">
            <GlassPanel className="space-y-3">
              <ProductSearch />
              <CustomerSelector />
            </GlassPanel>
            <ProductResults />
          </section>

          <SaleCart />

          <SaleSummary />
        </div>
      </div>
      <SaleSuccessModal />
    </main>
  );
}

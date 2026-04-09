"use client";

import { Search, UserRound } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { EmptyState } from "@/components/data/empty-state";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";
import { PosCart, type CartLine } from "@/components/pos/pos-cart";
import { PosProductResults } from "@/components/pos/pos-product-results";
import { GlassPanel } from "@/components/ui/glass-panel";
import { clientsService } from "@/lib/services/clients.service";
import { productsService } from "@/lib/services/products.service";
import { salesService } from "@/lib/services/sales.service";
import type { Client } from "@/modules/clients/types";
import type { Product } from "@/modules/products/types";

type PaymentMethod = "cash" | "card" | "transfer" | "mixed";

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
  {
    id: "prd-2",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Ibuprofeno 400mg",
    genericName: "Ibuprofeno",
    barcode: "7701234567892",
    sku: "PRD-1002",
    category: "medicamento",
    laboratory: "Lab Salud",
    requiresPrescription: false,
    controlled: false,
    costPrice: 1.5,
    salePrice: 3.2,
    stock: 80,
    active: true,
  },
];

const mockClients: Client[] = [
  {
    id: "cl-1",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "María Pérez",
    document: "V-12345678",
    phone: "+58 412 111 2222",
    email: "",
    address: "",
    birthDate: "",
    notes: "",
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function PosModule() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("none");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isClosingSale, setIsClosingSale] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBaseData() {
      setIsLoading(true);
      try {
        const [products, clients] = await Promise.all([productsService.getAll(), clientsService.getAll()]);
        if (!isMounted) return;
        setAllProducts(products.length ? products : mockProducts);
        setAllClients(clients.length ? clients : mockClients);
      } catch {
        if (!isMounted) return;
        setAllProducts(mockProducts);
        setAllClients(mockClients);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBaseData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = normalize(search);
    if (!q) return allProducts;

    return allProducts.filter((product) => {
      return (
        normalize(product.name).includes(q) ||
        normalize(product.genericName).includes(q) ||
        normalize(product.sku).includes(q) ||
        normalize(product.barcode).includes(q)
      );
    });
  }, [allProducts, search]);

  const selectedClient = useMemo(
    () => (selectedClientId === "none" ? null : allClients.find((client) => client.id === selectedClientId) ?? null),
    [allClients, selectedClientId],
  );
  const stockIssues = useMemo(() => {
    return cart
      .map((line) => {
        const product = allProducts.find((candidate) => candidate.id === line.product.id) ?? line.product;
        const available = product.stock;
        return {
          productId: line.product.id,
          productName: line.product.name,
          requested: line.quantity,
          available,
        };
      })
      .filter((issue) => issue.requested > issue.available);
  }, [allProducts, cart]);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id ? { ...line, quantity: Math.min(line.quantity + 1, 999) } : line,
        );
      }

      return [{ product, quantity: 1 }, ...current];
    });
  }

  function increment(productId: string) {
    setCart((current) =>
      current.map((line) =>
        line.product.id === productId ? { ...line, quantity: Math.min(line.quantity + 1, 999) } : line,
      ),
    );
  }

  function decrement(productId: string) {
    setCart((current) =>
      current
        .map((line) => (line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  function remove(productId: string) {
    setCart((current) => current.filter((line) => line.product.id !== productId));
  }

  async function finalizeSale() {
    if (!cart.length || isClosingSale) {
      return;
    }

    setIsClosingSale(true);
    setFeedback(null);

    try {
      const result = await salesService.closeSale({
        clientId: selectedClient?.id,
        paymentMethod,
        items: cart.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
          unitPrice: line.product.salePrice,
        })),
      });

      setFeedback({
        kind: "success",
        message: `Venta ${result.saleNumber} guardada correctamente por $${result.total.toFixed(2)}.`,
      });
      setCart([]);
      setSelectedClientId("none");
      setPaymentMethod("cash");
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "No fue posible finalizar la venta.",
      });
    } finally {
      setIsClosingSale(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="POS"
          subtitle="Base de caja ultra rápida con cierre seguro, descuento FIFO y consistencia transaccional."
          badge="Fase 1"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <ModuleStat label="Resultados" value={String(filteredProducts.length)} />
          <ModuleStat label="Items carrito" value={String(cart.reduce((sum, line) => sum + line.quantity, 0))} />
          <ModuleStat label="Cliente" value={selectedClient ? "Asignado" : "Sin cliente"} />
          <ModuleStat label="Estado" value="Persistencia lista" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-3">
            <GlassPanel className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, SKU, genérico o código de barras"
                  className="h-10 w-full rounded-xl border border-white/15 bg-slate-950/65 pl-9 pr-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-slate-400" />
                <select
                  value={selectedClientId}
                  onChange={(event) => setSelectedClientId(event.target.value)}
                  className="h-9 rounded-lg border border-white/15 bg-slate-950/65 px-3 text-xs text-slate-100 outline-none transition focus:border-cyan-300/80"
                >
                  <option value="none">Sin cliente</option>
                  {allClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.document})
                    </option>
                  ))}
                </select>
                {selectedClient ? <p className="text-xs text-cyan-200">Cliente: {selectedClient.name}</p> : null}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Pago:</span>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                  className="h-9 rounded-lg border border-white/15 bg-slate-950/65 px-3 text-xs text-slate-100 outline-none transition focus:border-cyan-300/80"
                >
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                  <option value="transfer">Transferencia</option>
                  <option value="mixed">Mixto</option>
                </select>
              </div>
            </GlassPanel>

            {feedback ? (
              <GlassPanel
                className={`border ${feedback.kind === "success" ? "border-emerald-300/30 bg-emerald-400/10" : "border-rose-300/30 bg-rose-400/10"}`}
              >
                <p className={`text-sm ${feedback.kind === "success" ? "text-emerald-100" : "text-rose-100"}`}>{feedback.message}</p>
              </GlassPanel>
            ) : null}

            {stockIssues.length ? (
              <GlassPanel className="border border-amber-300/35 bg-amber-400/10">
                <p className="text-sm font-medium text-amber-100">Stock insuficiente para cerrar la venta.</p>
                <ul className="mt-1 space-y-1 text-xs text-amber-50">
                  {stockIssues.map((issue) => (
                    <li key={issue.productId}>
                      {issue.productName}: solicitado {issue.requested}, disponible {issue.available}.
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            ) : null}

            {isLoading ? (
              <EmptyState title="Cargando POS" description="Preparando catálogo y clientes..." />
            ) : filteredProducts.length ? (
              <PosProductResults products={filteredProducts} onAdd={addToCart} />
            ) : (
              <EmptyState title="Sin resultados" description="Ajusta tu búsqueda para encontrar productos." />
            )}
          </section>

          <PosCart
            lines={cart}
            paymentMethodLabel={paymentMethod}
            isClosing={isClosingSale}
            hasStockIssues={stockIssues.length > 0}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={remove}
            onFinalizeSale={finalizeSale}
          />
        </div>
      </div>
    </main>
  );
}

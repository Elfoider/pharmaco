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
import type { Client } from "@/modules/clients/types";
import type { Product } from "@/modules/products/types";

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
  const [cart, setCart] = useState<CartLine[]>([]);
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

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="POS"
          subtitle="Base de caja ultra rápida: búsqueda, carrito y cliente sin persistir ventas aún."
          badge="Fase 1"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <ModuleStat label="Resultados" value={String(filteredProducts.length)} />
          <ModuleStat label="Items carrito" value={String(cart.reduce((sum, line) => sum + line.quantity, 0))} />
          <ModuleStat label="Cliente" value={selectedClient ? "Asignado" : "Sin cliente"} />
          <ModuleStat label="Estado" value="No persiste" />
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
            </GlassPanel>

            {isLoading ? (
              <EmptyState title="Cargando POS" description="Preparando catálogo y clientes..." />
            ) : filteredProducts.length ? (
              <PosProductResults products={filteredProducts} onAdd={addToCart} />
            ) : (
              <EmptyState title="Sin resultados" description="Ajusta tu búsqueda para encontrar productos." />
            )}
          </section>

          <PosCart lines={cart} onIncrement={increment} onDecrement={decrement} onRemove={remove} />
        </div>
      </div>
    </main>
  );
}

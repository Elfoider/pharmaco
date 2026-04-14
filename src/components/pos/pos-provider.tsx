"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import { useEffect, useState } from "react";

import { POS_MOCK_CUSTOMERS, POS_MOCK_PRODUCTS } from "@/components/pos/pos-mocks";
import type { PosCartItem, PosCustomer, PosProduct, PosState } from "@/components/pos/pos-types";
import { clientsService } from "@/lib/services/clients.service";
import { productsService } from "@/lib/services/products.service";
import { salesService } from "@/lib/services/sales.service";

type PosAction =
  | { type: "set-search"; payload: string }
  | { type: "set-customer-search"; payload: string }
  | { type: "set-customer"; payload: string | "none" }
  | { type: "add-product"; payload: PosProduct }
  | { type: "increment"; payload: string }
  | { type: "decrement"; payload: string }
  | { type: "set-quantity"; payload: { productId: string; quantity: number } }
  | { type: "set-note"; payload: { productId: string; note: string } }
  | { type: "set-discount"; payload: number }
  | { type: "set-tax-percent"; payload: number }
  | { type: "set-payment-method"; payload: "cash" | "card" | "transfer" | "mixed" }
  | { type: "remove"; payload: string }
  | { type: "clear-cart" };

const initialState: PosState = {
  search: "",
  customerSearch: "",
  selectedCustomerId: "none",
  cart: [],
  lastChangedProductId: null,
  manualDiscount: 0,
  taxPercent: 0,
  paymentMethod: "cash",
};

function reducer(state: PosState, action: PosAction): PosState {
  switch (action.type) {
    case "set-search":
      return { ...state, search: action.payload };
    case "set-customer":
      return { ...state, selectedCustomerId: action.payload };
    case "set-customer-search":
      return { ...state, customerSearch: action.payload };
    case "add-product": {
      if (action.payload.stock <= 0) {
        return state;
      }
      const found = state.cart.find((line) => line.product.id === action.payload.id);
      if (!found) {
        return {
          ...state,
          cart: [{ product: action.payload, quantity: 1 }, ...state.cart],
          lastChangedProductId: action.payload.id,
        };
      }

      return {
        ...state,
        cart: state.cart.map((line) =>
          line.product.id === action.payload.id
            ? { ...line, quantity: Math.min(line.quantity + 1, line.product.stock, 999) }
            : line,
        ),
        lastChangedProductId: action.payload.id,
      };
    }
    case "increment":
      return {
        ...state,
        cart: state.cart.map((line) =>
          line.product.id === action.payload
            ? { ...line, quantity: Math.min(line.quantity + 1, line.product.stock, 999) }
            : line,
        ),
        lastChangedProductId: action.payload,
      };
    case "decrement":
      return {
        ...state,
        cart: state.cart
          .map((line) => (line.product.id === action.payload ? { ...line, quantity: line.quantity - 1 } : line))
          .filter((line) => line.quantity > 0),
        lastChangedProductId: action.payload,
      };
    case "set-quantity":
      return {
        ...state,
        cart: state.cart.map((line) => {
          if (line.product.id !== action.payload.productId) {
            return line;
          }

          return {
            ...line,
            quantity: Number.isFinite(action.payload.quantity)
              ? Math.max(1, Math.min(action.payload.quantity, line.product.stock, 999))
              : line.quantity,
          };
        }),
        lastChangedProductId: action.payload.productId,
      };
    case "set-note":
      return {
        ...state,
        cart: state.cart.map((line) =>
          line.product.id === action.payload.productId ? { ...line, note: action.payload.note } : line,
        ),
      };
    case "set-discount":
      return {
        ...state,
        manualDiscount: Number.isFinite(action.payload) ? Math.max(0, action.payload) : state.manualDiscount,
      };
    case "set-tax-percent":
      return {
        ...state,
        taxPercent: Number.isFinite(action.payload) ? Math.max(0, action.payload) : state.taxPercent,
      };
    case "set-payment-method":
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case "remove":
      return {
        ...state,
        cart: state.cart.filter((line) => line.product.id !== action.payload),
        lastChangedProductId: action.payload,
      };
    case "clear-cart":
      return { ...state, cart: [], lastChangedProductId: null };
    default:
      return state;
  }
}

type PosContextShape = {
  state: PosState;
  products: PosProduct[];
  customers: PosCustomer[];
  filteredCustomers: PosCustomer[];
  filteredProducts: PosProduct[];
  selectedCustomer: PosCustomer | null;
  subtotal: number;
  discountedSubtotal: number;
  taxAmount: number;
  finalTotal: number;
  itemCount: number;
  isLoadingProducts: boolean;
  isLoadingCustomers: boolean;
  hasValidationErrors: boolean;
  validationMessages: string[];
  isClosingSale: boolean;
  closeSaleError: string | null;
  closeSaleSuccess: string | null;
  finalizeSale: () => Promise<boolean>;
  dispatch: React.Dispatch<PosAction>;
};

const PosContext = createContext<PosContextShape | null>(null);

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function PosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [products, setProducts] = useState<PosProduct[]>(POS_MOCK_PRODUCTS);
  const [customers, setCustomers] = useState<PosCustomer[]>(POS_MOCK_CUSTOMERS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isClosingSale, setIsClosingSale] = useState(false);
  const [closeSaleError, setCloseSaleError] = useState<string | null>(null);
  const [closeSaleSuccess, setCloseSaleSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const remoteProducts = await productsService.getAll(500);

        if (!isMounted) return;

        const mapped = remoteProducts.map((product) => ({
          id: product.id,
          name: product.name,
          genericName: product.genericName,
          sku: product.sku,
          barcode: product.barcode,
          price: product.salePrice,
          stock: product.stock,
          requiresPrescription: product.requiresPrescription,
          controlled: product.controlled,
        }));

        setProducts(mapped.length ? mapped : POS_MOCK_PRODUCTS);
      } catch {
        if (!isMounted) return;
        setProducts(POS_MOCK_PRODUCTS);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCustomers() {
      setIsLoadingCustomers(true);
      try {
        const remoteClients = await clientsService.getAll(400);
        if (!isMounted) return;

        const mapped = remoteClients.map((client) => ({
          id: client.id,
          name: client.name,
          document: client.document,
          phone: client.phone,
        }));

        setCustomers(mapped.length ? mapped : POS_MOCK_CUSTOMERS);
      } catch {
        if (!isMounted) return;
        setCustomers(POS_MOCK_CUSTOMERS);
      } finally {
        if (isMounted) {
          setIsLoadingCustomers(false);
        }
      }
    }

    void loadCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  const finalizeSale = useCallback(async () => {
    if (!state.cart.length || isClosingSale) {
      return false;
    }

    setIsClosingSale(true);
    setCloseSaleError(null);
    setCloseSaleSuccess(null);

    try {
      const subtotal = state.cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
      const safeDiscount = Math.min(state.manualDiscount, subtotal);
      const discountedSubtotal = Math.max(0, subtotal - safeDiscount);
      const taxAmount = discountedSubtotal * (state.taxPercent / 100);
      const finalTotal = discountedSubtotal + taxAmount;

      const result = await salesService.finalizePosSale({
        cashierId: undefined,
        clientId: state.selectedCustomerId === "none" ? null : state.selectedCustomerId,
        subtotal,
        discount: safeDiscount,
        tax: taxAmount,
        total: finalTotal,
        paymentMethod: state.paymentMethod,
        items: state.cart.map((line) => ({
          productId: line.product.id,
          productName: line.product.name,
          qty: line.quantity,
          unitPrice: line.product.price,
          subtotal: line.product.price * line.quantity,
        })),
      });

      dispatch({ type: "clear-cart" });
      setCloseSaleSuccess(`Venta ${result.saleNumber} registrada correctamente.`);
      return true;
    } catch (error) {
      setCloseSaleError(error instanceof Error ? error.message : "No fue posible registrar la venta.");
      return false;
    } finally {
      setIsClosingSale(false);
    }
  }, [dispatch, isClosingSale, state.cart, state.manualDiscount, state.paymentMethod, state.selectedCustomerId, state.taxPercent]);

  const value = useMemo<PosContextShape>(() => {
    const filteredProducts = products.filter((product) => {
      const q = normalize(state.search);
      if (!q) return true;

      return (
        normalize(product.name).includes(q) ||
        normalize(product.genericName).includes(q) ||
        normalize(product.sku).includes(q) ||
        normalize(product.barcode).includes(q)
      );
    });

    const filteredCustomers = customers.filter((customer) => {
      const q = normalize(state.customerSearch);
      if (!q) return true;

      return (
        normalize(customer.name).includes(q) ||
        normalize(customer.document).includes(q) ||
        normalize(customer.phone).includes(q)
      );
    });

    const selectedCustomer =
      state.selectedCustomerId === "none"
        ? null
        : customers.find((customer) => customer.id === state.selectedCustomerId) ?? null;

    const subtotal = state.cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
    const safeDiscount = Math.min(state.manualDiscount, subtotal);
    const discountedSubtotal = Math.max(0, subtotal - safeDiscount);
    const taxAmount = discountedSubtotal * (state.taxPercent / 100);
    const finalTotal = discountedSubtotal + taxAmount;
    const itemCount = state.cart.reduce((sum, line) => sum + line.quantity, 0);
    const validationMessages: string[] = [];

    if (!state.cart.length) {
      validationMessages.push("Agrega al menos un producto para continuar.");
    }
    if (state.manualDiscount > subtotal) {
      validationMessages.push("El descuento no puede ser mayor al subtotal.");
    }
    if (state.taxPercent > 100) {
      validationMessages.push("El impuesto configurado parece inválido (>100%).");
    }

    return {
      state,
      products,
      customers,
      filteredCustomers,
      filteredProducts,
      selectedCustomer,
      subtotal,
      discountedSubtotal,
      taxAmount,
      finalTotal,
      itemCount,
      isLoadingProducts,
      isLoadingCustomers,
      hasValidationErrors: validationMessages.length > 0,
      validationMessages,
      isClosingSale,
      closeSaleError,
      closeSaleSuccess,
      finalizeSale,
      dispatch,
    };
  }, [closeSaleError, closeSaleSuccess, customers, finalizeSale, isClosingSale, isLoadingCustomers, isLoadingProducts, products, state]);

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error("usePos debe usarse dentro de PosProvider");
  }

  return context;
}

export type { PosCartItem };

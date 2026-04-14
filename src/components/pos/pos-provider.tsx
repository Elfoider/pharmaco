"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { useEffect, useState } from "react";

import { POS_MOCK_CUSTOMERS, POS_MOCK_PRODUCTS } from "@/components/pos/pos-mocks";
import type { PosCartItem, PosCustomer, PosProduct, PosState } from "@/components/pos/pos-types";
import { productsService } from "@/lib/services/products.service";

type PosAction =
  | { type: "set-search"; payload: string }
  | { type: "set-customer"; payload: string | "none" }
  | { type: "add-product"; payload: PosProduct }
  | { type: "increment"; payload: string }
  | { type: "decrement"; payload: string }
  | { type: "set-quantity"; payload: { productId: string; quantity: number } }
  | { type: "set-note"; payload: { productId: string; note: string } }
  | { type: "remove"; payload: string }
  | { type: "clear-cart" };

const initialState: PosState = {
  search: "",
  selectedCustomerId: "none",
  cart: [],
  lastChangedProductId: null,
};

function reducer(state: PosState, action: PosAction): PosState {
  switch (action.type) {
    case "set-search":
      return { ...state, search: action.payload };
    case "set-customer":
      return { ...state, selectedCustomerId: action.payload };
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
  filteredProducts: PosProduct[];
  selectedCustomer: PosCustomer | null;
  subtotal: number;
  itemCount: number;
  isLoadingProducts: boolean;
  dispatch: React.Dispatch<PosAction>;
};

const PosContext = createContext<PosContextShape | null>(null);

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function PosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [products, setProducts] = useState<PosProduct[]>(POS_MOCK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

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

    const selectedCustomer =
      state.selectedCustomerId === "none"
        ? null
        : POS_MOCK_CUSTOMERS.find((customer) => customer.id === state.selectedCustomerId) ?? null;

    const subtotal = state.cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
    const itemCount = state.cart.reduce((sum, line) => sum + line.quantity, 0);

    return {
      state,
      products,
      customers: POS_MOCK_CUSTOMERS,
      filteredProducts,
      selectedCustomer,
      subtotal,
      itemCount,
      isLoadingProducts,
      dispatch,
    };
  }, [isLoadingProducts, products, state]);

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

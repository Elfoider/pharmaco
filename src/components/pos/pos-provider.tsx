"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

import { POS_MOCK_CUSTOMERS, POS_MOCK_PRODUCTS } from "@/components/pos/pos-mocks";
import type { PosCartItem, PosCustomer, PosProduct, PosState } from "@/components/pos/pos-types";

type PosAction =
  | { type: "set-search"; payload: string }
  | { type: "set-customer"; payload: string | "none" }
  | { type: "add-product"; payload: PosProduct }
  | { type: "increment"; payload: string }
  | { type: "decrement"; payload: string }
  | { type: "remove"; payload: string }
  | { type: "clear-cart" };

const initialState: PosState = {
  search: "",
  selectedCustomerId: "none",
  cart: [],
};

function reducer(state: PosState, action: PosAction): PosState {
  switch (action.type) {
    case "set-search":
      return { ...state, search: action.payload };
    case "set-customer":
      return { ...state, selectedCustomerId: action.payload };
    case "add-product": {
      const found = state.cart.find((line) => line.product.id === action.payload.id);
      if (!found) {
        return { ...state, cart: [{ product: action.payload, quantity: 1 }, ...state.cart] };
      }

      return {
        ...state,
        cart: state.cart.map((line) =>
          line.product.id === action.payload.id
            ? { ...line, quantity: Math.min(line.quantity + 1, 999) }
            : line,
        ),
      };
    }
    case "increment":
      return {
        ...state,
        cart: state.cart.map((line) =>
          line.product.id === action.payload ? { ...line, quantity: Math.min(line.quantity + 1, 999) } : line,
        ),
      };
    case "decrement":
      return {
        ...state,
        cart: state.cart
          .map((line) => (line.product.id === action.payload ? { ...line, quantity: line.quantity - 1 } : line))
          .filter((line) => line.quantity > 0),
      };
    case "remove":
      return { ...state, cart: state.cart.filter((line) => line.product.id !== action.payload) };
    case "clear-cart":
      return { ...state, cart: [] };
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
  dispatch: React.Dispatch<PosAction>;
};

const PosContext = createContext<PosContextShape | null>(null);

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function PosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<PosContextShape>(() => {
    const filteredProducts = POS_MOCK_PRODUCTS.filter((product) => {
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
      products: POS_MOCK_PRODUCTS,
      customers: POS_MOCK_CUSTOMERS,
      filteredProducts,
      selectedCustomer,
      subtotal,
      itemCount,
      dispatch,
    };
  }, [state]);

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

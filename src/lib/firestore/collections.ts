import { collection } from "firebase/firestore";

import { db } from "@/lib/firebase/client";

export const COLLECTIONS = {
  users: "users",
  employees: "employees",
  clients: "clients",
  products: "products",
  inventoryMovements: "inventory_movements",
} as const;

export function getCollectionRef(collectionName: (typeof COLLECTIONS)[keyof typeof COLLECTIONS]) {
  if (!db) {
    return null;
  }

  return collection(db, collectionName);
}

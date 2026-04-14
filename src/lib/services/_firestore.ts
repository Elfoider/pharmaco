import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";

export const COLLECTIONS = {
  users: "users",
  clients: "clients",
  employees: "employees",
  products: "products",
  batches: "batches",
  inventoryMovements: "inventory_movements",
  sales: "sales",
  saleItems: "sale_items",
  saleReturns: "sale_returns",
  saleReturnItems: "sale_return_items",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export type CreatePayload<T extends { id: string }> = Omit<T, "id">;
export type UpdatePayload<T extends { id: string }> = Partial<Omit<T, "id">>;

function getCollectionRef(collectionName: CollectionName) {
  if (!db) {
    throw new Error("Firestore no configurado");
  }

  return collection(db, collectionName);
}

export function createCrudService<T extends { id: string }>(collectionName: CollectionName) {
  return {
    async create(payload: CreatePayload<T>) {
      const ref = getCollectionRef(collectionName);
      const result = await addDoc(ref, payload);
      return result.id;
    },

    async getById(id: string): Promise<T | null> {
      const ref = doc(getCollectionRef(collectionName), id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        return null;
      }

      return { id: snap.id, ...snap.data() } as T;
    },

    async getAll(take = 100): Promise<T[]> {
      const ref = getCollectionRef(collectionName);
      const snap = await getDocs(query(ref, limit(take)));
      return snap.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
    },

    async update(id: string, payload: UpdatePayload<T>) {
      const ref = doc(getCollectionRef(collectionName), id);
      await updateDoc(ref, payload);
    },

    async delete(id: string) {
      const ref = doc(getCollectionRef(collectionName), id);
      await deleteDoc(ref);
    },
  };
}

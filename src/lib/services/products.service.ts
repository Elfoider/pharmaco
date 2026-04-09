import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Product } from "@/modules/products/types";
import type { ProductFormValues } from "@/lib/validations/product";

function getProductsCollection() {
  if (!db) {
    throw new Error("Firestore no configurado");
  }

  return collection(db, "products");
}

function normalize(value?: string) {
  return (value ?? "").toLowerCase().trim();
}

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    status: data.status === "inactive" || data.status === "archived" ? data.status : "active",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    name: typeof data.name === "string" ? data.name : "",
    genericName: typeof data.genericName === "string" ? data.genericName : "",
    barcode: typeof data.barcode === "string" ? data.barcode : "",
    sku: typeof data.sku === "string" ? data.sku : "",
    category: typeof data.category === "string" ? data.category : "",
    laboratory: typeof data.laboratory === "string" ? data.laboratory : "",
    requiresPrescription: data.requiresPrescription === true,
    controlled: data.controlled === true,
    costPrice: typeof data.costPrice === "number" ? data.costPrice : 0,
    salePrice: typeof data.salePrice === "number" ? data.salePrice : 0,
    stock: typeof data.stock === "number" ? data.stock : 0,
    active: data.active !== false,
  };
}

export const productsService = {
  async create(payload: ProductFormValues) {
    const now = new Date().toISOString();
    const result = await addDoc(getProductsCollection(), {
      ...payload,
      status: payload.active ? "active" : "inactive",
      createdAt: now,
      updatedAt: now,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    });

    return result.id;
  },

  async getById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(getProductsCollection(), id));
    if (!snap.exists()) return null;
    return mapProduct(snap.id, snap.data());
  },

  async getAll(take = 150): Promise<Product[]> {
    const snap = await getDocs(query(getProductsCollection(), orderBy("name", "asc"), limit(take)));
    return snap.docs.map((item) => mapProduct(item.id, item.data()));
  },

  async search(term: string, categoryFilter = "all", take = 150): Promise<Product[]> {
    const all = await this.getAll(take);
    const q = normalize(term);

    return all.filter((product) => {
      const byCategory = categoryFilter === "all" ? true : normalize(product.category) === normalize(categoryFilter);
      if (!q) return byCategory;

      const byName = normalize(product.name).includes(q);
      const byGeneric = normalize(product.genericName).includes(q);
      const bySku = normalize(product.sku).includes(q);
      const byBarcode = normalize(product.barcode).includes(q);

      return byCategory && (byName || byGeneric || bySku || byBarcode);
    });
  },

  async update(id: string, payload: Partial<ProductFormValues>) {
    await updateDoc(doc(getProductsCollection(), id), {
      ...payload,
      status: payload.active === undefined ? undefined : payload.active ? "active" : "inactive",
      updatedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp(),
    });
  },

  async delete(id: string) {
    await deleteDoc(doc(getProductsCollection(), id));
  },
};

export const batchesService = {
  create: async () => {
    throw new Error("Lotes no implementado en esta fase");
  },
  getById: async () => {
    throw new Error("Lotes no implementado en esta fase");
  },
  getAll: async () => {
    throw new Error("Lotes no implementado en esta fase");
  },
  update: async () => {
    throw new Error("Lotes no implementado en esta fase");
  },
  delete: async () => {
    throw new Error("Lotes no implementado en esta fase");
  },
};

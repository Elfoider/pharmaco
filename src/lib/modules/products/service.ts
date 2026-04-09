import { COLLECTIONS } from "@/lib/firestore/collections";
import { createDocument, getDocument, listDocuments } from "@/lib/firestore/base-service";
import type { Product } from "@/lib/domain/types";

export const productsService = {
  list: (take?: number) => listDocuments<Product>(COLLECTIONS.products, take),
  getById: (id: string) => getDocument<Product>(COLLECTIONS.products, id),
  create: (payload: Omit<Product, "id">) => createDocument(COLLECTIONS.products, payload),
};

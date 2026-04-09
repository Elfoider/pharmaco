import { COLLECTIONS } from "@/lib/firestore/collections";
import { createDocument, getDocument, listDocuments } from "@/lib/firestore/base-service";
import type { Client } from "@/lib/domain/types";

export const clientsService = {
  list: (take?: number) => listDocuments<Client>(COLLECTIONS.clients, take),
  getById: (id: string) => getDocument<Client>(COLLECTIONS.clients, id),
  create: (payload: Omit<Client, "id">) => createDocument(COLLECTIONS.clients, payload),
};

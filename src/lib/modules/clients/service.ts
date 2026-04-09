import {
  addDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import type { Client } from "@/lib/domain/types";
import { getCollectionRef } from "@/lib/firestore/collections";
import type { ClientFormValues } from "@/lib/validations/client";

function normalizeText(value?: string) {
  return (value ?? "").toLowerCase().trim();
}

function mapDocToClient(input: { id: string; data: Record<string, unknown> }): Client {
  const data = input.data;

  return {
    id: input.id,
    status: data.status === "inactive" || data.status === "archived" ? data.status : "active",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    code: typeof data.code === "string" ? data.code : "",
    clientType: data.clientType === "empresa" ? "empresa" : "persona",
    fullName: typeof data.fullName === "string" ? data.fullName : "",
    documentId: typeof data.documentId === "string" ? data.documentId : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    email: typeof data.email === "string" ? data.email : "",
    address: typeof data.address === "string" ? data.address : "",
  };
}

async function fetchClientsRaw(take = 120) {
  const colRef = getCollectionRef("clients");
  if (!colRef) {
    return [] as Client[];
  }

  const snapshot = await getDocs(query(colRef, orderBy("fullName", "asc"), limit(take)));
  return snapshot.docs.map((item) => mapDocToClient({ id: item.id, data: item.data() }));
}

export const clientsService = {
  async list(take = 120) {
    return fetchClientsRaw(take);
  },

  async search(term: string, take = 120) {
    const normalized = normalizeText(term);
    const clients = await fetchClientsRaw(take);

    if (!normalized) {
      return clients;
    }

    return clients.filter((client) => {
      const byName = normalizeText(client.fullName).includes(normalized);
      const byDocument = normalizeText(client.documentId).includes(normalized);
      const byPhone = normalizeText(client.phone).includes(normalized);
      return byName || byDocument || byPhone;
    });
  },

  async create(payload: ClientFormValues) {
    const colRef = getCollectionRef("clients");
    if (!colRef) {
      throw new Error("Firestore no configurado");
    }

    const now = new Date().toISOString();

    await addDoc(colRef, {
      ...payload,
      status: "active",
      createdAt: now,
      updatedAt: now,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    });
  },

  async update(clientId: string, payload: ClientFormValues) {
    const colRef = getCollectionRef("clients");
    if (!colRef) {
      throw new Error("Firestore no configurado");
    }

    const ref = doc(colRef, clientId);

    await updateDoc(ref, {
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp(),
    });
  },
};

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Client } from "@/modules/clients/types";
import type { ClientFormValues } from "@/lib/validations/client";

function getClientsCollection() {
  if (!db) {
    throw new Error("Firestore no configurado");
  }

  return collection(db, "clients");
}

function normalize(value?: string) {
  return (value ?? "").toLowerCase().trim();
}

function mapClient(id: string, data: Record<string, unknown>): Client {
  return {
    id,
    status: data.status === "inactive" || data.status === "archived" ? data.status : "active",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    name: typeof data.name === "string" ? data.name : "",
    document: typeof data.document === "string" ? data.document : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    email: typeof data.email === "string" ? data.email : "",
    address: typeof data.address === "string" ? data.address : "",
    birthDate: typeof data.birthDate === "string" ? data.birthDate : "",
    notes: typeof data.notes === "string" ? data.notes : "",
  };
}

export const clientsService = {
  async create(payload: Omit<Client, "id" | "status" | "createdAt" | "updatedAt">) {
    const ref = getClientsCollection();
    const now = new Date().toISOString();

    const result = await addDoc(ref, {
      ...payload,
      status: "active",
      createdAt: now,
      updatedAt: now,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    });

    return result.id;
  },

  async getById(id: string): Promise<Client | null> {
    const snap = await getDoc(doc(getClientsCollection(), id));
    if (!snap.exists()) return null;
    return mapClient(snap.id, snap.data());
  },

  async getAll(take = 120): Promise<Client[]> {
    const snap = await getDocs(query(getClientsCollection(), orderBy("name", "asc"), limit(take)));
    return snap.docs.map((item) => mapClient(item.id, item.data()));
  },

  async search(term: string, take = 120): Promise<Client[]> {
    const all = await this.getAll(take);
    const q = normalize(term);
    if (!q) return all;

    return all.filter((client) => {
      return (
        normalize(client.name).includes(q) ||
        normalize(client.document).includes(q) ||
        normalize(client.phone).includes(q)
      );
    });
  },

  async update(id: string, payload: Partial<ClientFormValues>) {
    await updateDoc(doc(getClientsCollection(), id), {
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp(),
    });
  },

  async delete(id: string) {
    await deleteDoc(doc(getClientsCollection(), id));
  },
};

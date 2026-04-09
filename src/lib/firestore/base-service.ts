import { addDoc, doc, getDoc, getDocs, limit, query } from "firebase/firestore";

import { getCollectionRef } from "@/lib/firestore/collections";

export async function listDocuments<T>(collectionName: string, take = 30): Promise<T[]> {
  const colRef = getCollectionRef(collectionName as never);

  if (!colRef) {
    return [];
  }

  const snapshot = await getDocs(query(colRef, limit(take)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

export async function createDocument<T extends object>(collectionName: string, payload: T) {
  const colRef = getCollectionRef(collectionName as never);

  if (!colRef) {
    throw new Error("Firestore no configurado");
  }

  return addDoc(colRef, payload);
}

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const colRef = getCollectionRef(collectionName as never);

  if (!colRef) {
    return null;
  }

  const ref = doc(colRef, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return { id: snap.id, ...snap.data() } as T;
}

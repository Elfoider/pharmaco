import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type {
  AdjustmentInput,
  Batch,
  EntryInput,
  InventoryMovement,
} from "@/modules/inventory/types";

function assertDb() {
  if (!db) {
    throw new Error("Firestore no configurado");
  }

  return db;
}

const BATCHES = "batches";
const PRODUCTS = "products";
const MOVEMENTS = "inventory_movements";

function toISOString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function mapBatch(id: string, data: Record<string, unknown>): Batch {
  return {
    id,
    productId: typeof data.productId === "string" ? data.productId : "",
    lotNumber: typeof data.lotNumber === "string" ? data.lotNumber : "",
    expiryDate: toISOString(data.expiryDate),
    stock: asNumber(data.stock),
    branchId: typeof data.branchId === "string" ? data.branchId : "",
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  };
}

function mapMovement(id: string, data: Record<string, unknown>): InventoryMovement {
  return {
    id,
    type: data.type === "entrada" || data.type === "salida" || data.type === "ajuste" ? data.type : "ajuste",
    productId: typeof data.productId === "string" ? data.productId : "",
    batchId: typeof data.batchId === "string" ? data.batchId : "",
    quantity: asNumber(data.quantity),
    reason: typeof data.reason === "string" ? data.reason : "",
    createdAt: toISOString(data.createdAt),
  };
}

function daysBetweenTodayAnd(dateValue: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(dateValue);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export const inventoryService = {
  async entry(input: EntryInput) {
    if (input.quantity <= 0) {
      throw new Error("La cantidad de entrada debe ser mayor que 0");
    }

    const now = new Date().toISOString();

    const firestore = assertDb();

    return runTransaction(firestore, async (transaction) => {
      const productRef = doc(collection(firestore, PRODUCTS), input.productId);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error("Producto no existe");
      }

      const productData = productSnap.data();
      const currentProductStock = asNumber(productData.stock);

      const batchCollection = collection(firestore, BATCHES);
      const normalizedLot = input.lotNumber.trim().replace(/\s+/g, "-").toLowerCase();
      const batchRef = doc(batchCollection, `${input.productId}__${normalizedLot}`);
      const batchSnap = await transaction.get(batchRef);
      let finalBatchStock = input.quantity;

      if (batchSnap.exists()) {
        finalBatchStock = asNumber(batchSnap.data().stock) + input.quantity;
        transaction.update(batchRef, {
          stock: finalBatchStock,
          expiryDate: input.expiryDate,
          branchId: input.branchId,
          updatedAt: now,
          updatedAtServer: serverTimestamp(),
        });
      } else {
        transaction.set(batchRef, {
          productId: input.productId,
          lotNumber: input.lotNumber,
          expiryDate: input.expiryDate,
          stock: input.quantity,
          branchId: input.branchId,
          createdAt: now,
          updatedAt: now,
          createdAtServer: serverTimestamp(),
          updatedAtServer: serverTimestamp(),
        });
      }

      transaction.update(productRef, {
        stock: currentProductStock + input.quantity,
        updatedAt: now,
        updatedAtServer: serverTimestamp(),
      });

      const movementRef = doc(collection(firestore, MOVEMENTS));
      transaction.set(movementRef, {
        type: "entrada",
        productId: input.productId,
        batchId: batchRef.id,
        quantity: input.quantity,
        reason: input.reason,
        createdAt: now,
        createdAtServer: serverTimestamp(),
      });

      return {
        movementId: movementRef.id,
        batchId: batchRef.id,
        batchStock: finalBatchStock,
      };
    });
  },

  async manualAdjust(input: AdjustmentInput) {
    if (input.quantity === 0) {
      throw new Error("El ajuste no puede ser 0");
    }

    const now = new Date().toISOString();
    const firestore = assertDb();

    return runTransaction(firestore, async (transaction) => {
      const productRef = doc(collection(firestore, PRODUCTS), input.productId);
      const batchRef = doc(collection(firestore, BATCHES), input.batchId);

      const [productSnap, batchSnap] = await Promise.all([
        transaction.get(productRef),
        transaction.get(batchRef),
      ]);

      if (!productSnap.exists()) {
        throw new Error("Producto no existe");
      }

      if (!batchSnap.exists()) {
        throw new Error("Lote no existe");
      }

      const batchData = batchSnap.data();
      if (batchData.productId !== input.productId) {
        throw new Error("El lote no pertenece al producto");
      }

      const currentBatchStock = asNumber(batchData.stock);
      const currentProductStock = asNumber(productSnap.data().stock);

      const nextBatchStock = currentBatchStock + input.quantity;
      const nextProductStock = currentProductStock + input.quantity;

      if (nextBatchStock < 0 || nextProductStock < 0) {
        throw new Error("El ajuste genera stock negativo");
      }

      transaction.update(batchRef, {
        stock: nextBatchStock,
        updatedAt: now,
        updatedAtServer: serverTimestamp(),
      });

      transaction.update(productRef, {
        stock: nextProductStock,
        updatedAt: now,
        updatedAtServer: serverTimestamp(),
      });

      const movementRef = doc(collection(firestore, MOVEMENTS));
      transaction.set(movementRef, {
        type: "ajuste",
        productId: input.productId,
        batchId: input.batchId,
        quantity: input.quantity,
        reason: input.reason,
        createdAt: now,
        createdAtServer: serverTimestamp(),
      });

      return {
        movementId: movementRef.id,
        batchStock: nextBatchStock,
        productStock: nextProductStock,
      };
    });
  },

  async getMovementHistory(productId?: string): Promise<InventoryMovement[]> {
    const snap = await getDocs(query(collection(assertDb(), MOVEMENTS), orderBy("createdAt", "desc"), limit(250)));
    const mapped = snap.docs.map((item) => mapMovement(item.id, item.data()));

    if (!productId || productId === "all") {
      return mapped;
    }

    return mapped.filter((movement) => movement.productId === productId);
  },

  async getBatchesByProduct(productId = "all"): Promise<Batch[]> {
    const snap = await getDocs(query(collection(assertDb(), BATCHES), orderBy("expiryDate", "asc"), limit(300)));
    const mapped = snap.docs.map((item) => mapBatch(item.id, item.data()));

    if (productId === "all") {
      return mapped;
    }

    return mapped.filter((batch) => batch.productId === productId);
  },

  async getExpiringBatches(days = 60): Promise<Batch[]> {
    const batches = await this.getBatchesByProduct("all");

    return batches.filter((batch) => {
      if (!batch.expiryDate || batch.stock <= 0) {
        return false;
      }

      const remainingDays = daysBetweenTodayAnd(batch.expiryDate);
      return remainingDays >= 0 && remainingDays <= days;
    });
  },
};

export type { Batch, InventoryMovement } from "@/modules/inventory/types";

import { collection, doc, getDocs, orderBy, query, runTransaction, serverTimestamp, where } from "firebase/firestore";

import { auth, db } from "@/lib/firebase/client";
import type { Sale, SaleItem } from "@/modules/sales/types";
import { COLLECTIONS, createCrudService } from "@/lib/services/_firestore";

export type PosFinalizeItemInput = {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
};

export type PosFinalizeSaleInput = {
  clientId: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: Sale["paymentMethod"];
  items: PosFinalizeItemInput[];
  cashierId?: string;
};

function assertDb() {
  if (!db) {
    throw new Error("Firestore no configurado");
  }

  return db;
}

function createSaleNumber() {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `SALE-${timestamp}-${rand}`;
}

export const salesService = {
  ...createCrudService<Sale>(COLLECTIONS.sales),

  async finalizePosSale(input: PosFinalizeSaleInput) {
    if (!input.items.length) {
      throw new Error("No hay productos en el carrito");
    }

    const invalidItem = input.items.find((item) => item.qty <= 0 || item.unitPrice < 0 || item.subtotal < 0);
    if (invalidItem) {
      throw new Error("Hay ítems inválidos en la venta");
    }

    const firestore = assertDb();
    const now = new Date().toISOString();
    const saleNumber = createSaleNumber();
    const batchesCollection = collection(firestore, COLLECTIONS.batches);
    const productsCollection = collection(firestore, COLLECTIONS.products);
    const movementsCollection = collection(firestore, COLLECTIONS.inventoryMovements);
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    const batchOrderByProduct = new Map<string, string[]>();

    for (const productId of productIds) {
      const batchesSnap = await getDocs(
        query(
          batchesCollection,
          where("productId", "==", productId),
          orderBy("expiryDate", "asc"),
        ),
      );

      batchOrderByProduct.set(productId, batchesSnap.docs.map((item) => item.id));
    }

    return runTransaction(firestore, async (transaction) => {
      const salesCollection = collection(firestore, COLLECTIONS.sales);
      const saleItemsCollection = collection(firestore, COLLECTIONS.saleItems);
      const saleRef = doc(salesCollection);

      const salePayload = {
        status: "active",
        saleNumber,
        cashierUserId: input.cashierId ?? auth?.currentUser?.uid ?? "cashier-local",
        clientId: input.clientId,
        subtotal: input.subtotal,
        discountTotal: input.discount,
        taxTotal: input.tax,
        total: input.total,
        paymentMethod: input.paymentMethod,
        createdAt: now,
        updatedAt: now,
        createdAtServer: serverTimestamp(),
        updatedAtServer: serverTimestamp(),
      };

      transaction.set(saleRef, salePayload);

      for (const item of input.items) {
        const batchIds = batchOrderByProduct.get(item.productId) ?? [];
        const availableBatches: Array<{ id: string; stock: number }> = [];

        for (const batchId of batchIds) {
          const batchRef = doc(batchesCollection, batchId);
          const batchSnap = await transaction.get(batchRef);
          if (!batchSnap.exists()) {
            continue;
          }

          const stock = Number(batchSnap.data().stock ?? 0);
          if (!Number.isFinite(stock) || stock <= 0) {
            continue;
          }

          availableBatches.push({ id: batchId, stock });
        }

        const availableStock = availableBatches.reduce((sum, batch) => sum + batch.stock, 0);
        if (availableStock < item.qty) {
          throw new Error(`Stock insuficiente para ${item.productName}`);
        }

        let pendingDiscount = item.qty;
        for (const batch of availableBatches) {
          if (pendingDiscount <= 0) {
            break;
          }

          const discountQty = Math.min(batch.stock, pendingDiscount);
          const nextBatchStock = batch.stock - discountQty;
          if (nextBatchStock < 0) {
            throw new Error(`Stock negativo detectado en lote ${batch.id}`);
          }

          transaction.update(doc(batchesCollection, batch.id), {
            stock: nextBatchStock,
            updatedAt: now,
            updatedAtServer: serverTimestamp(),
          });

          const movementRef = doc(movementsCollection);
          transaction.set(movementRef, {
            productId: item.productId,
            batchId: batch.id,
            quantity: discountQty,
            type: "salida",
            reason: "venta POS",
            referenceSaleId: saleRef.id,
            createdAt: now,
            createdAtServer: serverTimestamp(),
          });

          pendingDiscount -= discountQty;
        }

        if (pendingDiscount > 0) {
          throw new Error(`No fue posible aplicar FIFO para ${item.productName}`);
        }

        const productRef = doc(productsCollection, item.productId);
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists()) {
          throw new Error(`Producto no existe: ${item.productId}`);
        }
        const currentProductStock = Number(productSnap.data().stock ?? 0);
        const nextProductStock = currentProductStock - item.qty;
        if (!Number.isFinite(nextProductStock) || nextProductStock < 0) {
          throw new Error(`Stock insuficiente para ${item.productName}`);
        }
        transaction.update(productRef, {
          stock: nextProductStock,
          updatedAt: now,
          updatedAtServer: serverTimestamp(),
        });

        const itemRef = doc(saleItemsCollection);

        const itemPayload: Omit<SaleItem, "id"> & {
          productName: string;
          qty: number;
          subtotal: number;
        } = {
          status: "active",
          saleId: saleRef.id,
          productId: item.productId,
          quantity: item.qty,
          qty: item.qty,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          discount: 0,
          lineTotal: item.subtotal,
          productName: item.productName,
          createdAt: now,
          updatedAt: now,
        };

        transaction.set(itemRef, {
          ...itemPayload,
          createdAtServer: serverTimestamp(),
          updatedAtServer: serverTimestamp(),
        });
      }

      return {
        saleId: saleRef.id,
        saleNumber,
      };
    });
  },
};

export const saleItemsService = createCrudService<SaleItem>(COLLECTIONS.saleItems);

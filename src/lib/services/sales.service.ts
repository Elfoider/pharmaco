import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Sale, SaleItem } from "@/modules/sales/types";
import { COLLECTIONS, createCrudService } from "@/lib/services/_firestore";

export type CloseSaleItemInput = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type CloseSaleInput = {
  clientId?: string;
  paymentMethod: Sale["paymentMethod"];
  items: CloseSaleItemInput[];
  cashierUserId?: string;
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

  async closeSale(input: CloseSaleInput) {
    if (!input.items.length) {
      throw new Error("No hay productos en el carrito");
    }

    const invalidItem = input.items.find((item) => item.quantity <= 0 || item.unitPrice < 0);
    if (invalidItem) {
      throw new Error("Hay líneas inválidas en la venta");
    }

    const firestore = assertDb();
    const now = new Date().toISOString();
    const saleNumber = createSaleNumber();
    const batchesCollection = collection(firestore, COLLECTIONS.batches);
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    const batchOrderByProduct = new Map<string, string[]>();

    for (const productId of productIds) {
      const batchSnap = await getDocs(
        query(
          batchesCollection,
          where("productId", "==", productId),
          orderBy("expiryDate", "asc"),
        ),
      );
      batchOrderByProduct.set(
        productId,
        batchSnap.docs.map((batchDoc) => batchDoc.id),
      );
    }

    return runTransaction(firestore, async (transaction) => {
      const salesCollection = collection(firestore, COLLECTIONS.sales);
      const saleItemsCollection = collection(firestore, COLLECTIONS.saleItems);
      const inventoryMovementsCollection = collection(firestore, COLLECTIONS.inventoryMovements);
      const productsCollection = collection(firestore, COLLECTIONS.products);

      const saleRef = doc(salesCollection);
      const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

      const salePayload: Omit<Sale, "id"> = {
        status: "active",
        createdAt: now,
        updatedAt: now,
        saleNumber,
        clientId: input.clientId,
        cashierUserId: input.cashierUserId ?? "cashier-local",
        subtotal,
        discountTotal: 0,
        taxTotal: 0,
        total: subtotal,
        paymentMethod: input.paymentMethod,
      };

      transaction.set(saleRef, {
        ...salePayload,
        createdAtServer: serverTimestamp(),
        updatedAtServer: serverTimestamp(),
      });

      for (const item of input.items) {
        const lineTotal = item.quantity * item.unitPrice;

        const batchIds = batchOrderByProduct.get(item.productId) ?? [];
        const batchDocs: Array<{ id: string; data: Record<string, unknown> }> = [];

        for (const batchId of batchIds) {
          const batchRef = doc(batchesCollection, batchId);
          const batchSnap = await transaction.get(batchRef);
          if (!batchSnap.exists()) {
            continue;
          }
          batchDocs.push({ id: batchSnap.id, data: batchSnap.data() });
        }

        const totalAvailable = batchDocs.reduce((sum, batchDoc) => {
          const batchStock = Number(batchDoc.data.stock ?? 0);
          return sum + (Number.isFinite(batchStock) ? batchStock : 0);
        }, 0);

        if (totalAvailable < item.quantity) {
          throw new Error(`Stock insuficiente para producto ${item.productId}`);
        }

        let remainingToDiscount = item.quantity;
        for (const batchDoc of batchDocs) {
          if (remainingToDiscount <= 0) {
            break;
          }

          const currentStock = Number(batchDoc.data.stock ?? 0);
          if (!Number.isFinite(currentStock) || currentStock <= 0) {
            continue;
          }

          const discount = Math.min(currentStock, remainingToDiscount);
          const nextStock = currentStock - discount;

          if (nextStock < 0) {
            throw new Error(`Stock negativo detectado en lote ${batchDoc.id}`);
          }

          transaction.update(doc(batchesCollection, batchDoc.id), {
            stock: nextStock,
            updatedAt: now,
            updatedAtServer: serverTimestamp(),
          });

          const movementRef = doc(inventoryMovementsCollection);
          transaction.set(movementRef, {
            type: "salida",
            productId: item.productId,
            batchId: batchDoc.id,
            quantity: discount,
            reason: `Venta ${saleNumber}`,
            createdAt: now,
            createdAtServer: serverTimestamp(),
          });

          remainingToDiscount -= discount;
        }

        if (remainingToDiscount > 0) {
          throw new Error(`No fue posible completar FIFO para ${item.productId}`);
        }

        const productRef = doc(productsCollection, item.productId);
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists()) {
          throw new Error(`Producto no existe: ${item.productId}`);
        }
        const currentProductStock = Number(productSnap.data().stock ?? 0);
        const nextProductStock = currentProductStock - item.quantity;
        if (!Number.isFinite(nextProductStock) || nextProductStock < 0) {
          throw new Error(`Stock insuficiente de producto ${item.productId}`);
        }
        transaction.update(productRef, {
          stock: nextProductStock,
          updatedAt: now,
          updatedAtServer: serverTimestamp(),
        });

        const itemRef = doc(saleItemsCollection);
        const itemPayload: Omit<SaleItem, "id"> = {
          status: "active",
          createdAt: now,
          updatedAt: now,
          saleId: saleRef.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: 0,
          lineTotal,
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
        total: subtotal,
        itemsCount: input.items.length,
      };
    });
  },
};

export const saleItemsService = createCrudService<SaleItem>(COLLECTIONS.saleItems);

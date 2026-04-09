import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
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

    return runTransaction(firestore, async (transaction) => {
      const salesCollection = collection(firestore, COLLECTIONS.sales);
      const saleItemsCollection = collection(firestore, COLLECTIONS.saleItems);

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

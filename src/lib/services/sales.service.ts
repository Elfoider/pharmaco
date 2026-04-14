import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";

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

import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";

import { buildAnalyticsSeedData } from "./analytics-seed/data.mjs";
import { COLLECTIONS, getSeedFirestore } from "./analytics-seed/config.mjs";

async function run() {
  const db = getSeedFirestore();
  const payload = buildAnalyticsSeedData();

  const productIdByKey = new Map();
  const now = new Date().toISOString();

  for (const product of payload.products) {
    const productRef = await addDoc(collection(db, COLLECTIONS.products), {
      status: "active",
      name: product.name,
      genericName: product.genericName,
      barcode: `7701000${product.sku.replace(/\D/g, "")}`,
      sku: product.sku,
      category: "medicamento",
      laboratory: "PHARMACO LAB",
      requiresPrescription: false,
      controlled: false,
      costPrice: product.cost,
      salePrice: product.price,
      stock: 500,
      active: true,
      seedTag: payload.seedTag,
      createdAt: now,
      updatedAt: now,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    });
    productIdByKey.set(product.key, productRef.id);
  }

  for (const sale of payload.sales) {
    const saleRef = await addDoc(collection(db, COLLECTIONS.sales), {
      status: "active",
      saleNumber: sale.saleNumber,
      cashierUserId: "seed-cashier",
      clientId: null,
      subtotal: sale.subtotal,
      discountTotal: sale.discountTotal,
      taxTotal: sale.taxTotal,
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      saleItemIds: [],
      itemTypesCount: sale.lines.length,
      itemsQuantityTotal: sale.lines.reduce((sum, line) => sum + line.qty, 0),
      returnStatus: "none",
      returnedItemsQuantity: 0,
      returnedAmountTotal: 0,
      seedTag: payload.seedTag,
      createdAt: sale.createdAt,
      updatedAt: sale.createdAt,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    });

    const itemIds = [];
    for (const line of sale.lines) {
      const productId = productIdByKey.get(line.productKey);
      if (!productId) continue;

      const lineSubtotal = Number((line.qty * line.unitPrice).toFixed(2));
      const itemRef = await addDoc(collection(db, COLLECTIONS.saleItems), {
        status: "active",
        saleId: saleRef.id,
        saleNumber: sale.saleNumber,
        productId,
        quantity: line.qty,
        originalQuantity: line.qty,
        returnedQuantity: 0,
        returnStatus: "none",
        unitPrice: line.unitPrice,
        discount: 0,
        lineTotal: lineSubtotal,
        seedTag: payload.seedTag,
        createdAt: sale.createdAt,
        updatedAt: sale.createdAt,
        createdAtServer: serverTimestamp(),
        updatedAtServer: serverTimestamp(),
      });
      itemIds.push(itemRef.id);
    }

    await updateDoc(doc(db, COLLECTIONS.sales, saleRef.id), {
      saleItemIds: itemIds,
      updatedAt: sale.createdAt,
      updatedAtServer: serverTimestamp(),
    });
  }

  console.log(`Seed completado. Tag: ${payload.seedTag}`);
  console.log(`Productos: ${payload.products.length}, Ventas: ${payload.sales.length}, Sale items: ${payload.sales.length * 2}`);
}

run().catch((error) => {
  console.error("Error ejecutando seed analytics:", error);
  process.exit(1);
});

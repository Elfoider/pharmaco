import { ANALYTICS_SEED_TAG } from "./config.mjs";

function isoDateOffset(daysAgo) {
  const date = new Date();
  date.setHours(10, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function saleNumberByDate(date, index) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `SALE-${yyyy}${mm}${dd}-${String(index + 1).padStart(3, "0")}`;
}

export function buildAnalyticsSeedData() {
  const products = [
    { key: "prd-1", name: "Paracetamol 500mg", genericName: "Acetaminofén", price: 2.5, cost: 1.2, sku: "PRD-1001" },
    { key: "prd-2", name: "Amoxicilina 500mg", genericName: "Amoxicilina", price: 5.7, cost: 3.4, sku: "PRD-1002" },
    { key: "prd-3", name: "Ibuprofeno 400mg", genericName: "Ibuprofeno", price: 2.9, cost: 1.6, sku: "PRD-1003" },
    { key: "prd-4", name: "Loratadina 10mg", genericName: "Loratadina", price: 1.9, cost: 0.8, sku: "PRD-1004" },
  ];

  const sales = Array.from({ length: 12 }, (_, index) => {
    const createdAt = isoDateOffset(11 - index);
    const qtyA = 8 + (index % 4);
    const qtyB = 5 + ((index + 1) % 5);
    const firstProduct = index % 2 === 0 ? products[0] : products[1];
    const secondProduct = index % 3 === 0 ? products[2] : products[3];
    const subtotal = qtyA * firstProduct.price + qtyB * secondProduct.price;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    return {
      index,
      createdAt,
      saleNumber: saleNumberByDate(createdAt, index),
      subtotal,
      discountTotal: 0,
      taxTotal: tax,
      total,
      paymentMethod: index % 3 === 0 ? "card" : "cash",
      lines: [
        {
          productKey: firstProduct.key,
          qty: qtyA,
          unitPrice: firstProduct.price,
        },
        {
          productKey: secondProduct.key,
          qty: qtyB,
          unitPrice: secondProduct.price,
        },
      ],
    };
  });

  return {
    seedTag: ANALYTICS_SEED_TAG,
    products,
    sales,
  };
}

import type { TimeSeries } from "@/modules/analytics/types";

export type MockProductSalesRecord = {
  productId: string;
  productName: string;
  date: string;
  units: number;
  total: number;
};

export const MOCK_PRODUCT_SALES: MockProductSalesRecord[] = [
  { productId: "prd-1", productName: "Paracetamol 500mg", date: "2026-03-25", units: 28, total: 74.2 },
  { productId: "prd-1", productName: "Paracetamol 500mg", date: "2026-03-26", units: 30, total: 79.5 },
  { productId: "prd-1", productName: "Paracetamol 500mg", date: "2026-03-27", units: 31, total: 82.1 },
  { productId: "prd-1", productName: "Paracetamol 500mg", date: "2026-03-28", units: 34, total: 90.6 },
  { productId: "prd-1", productName: "Paracetamol 500mg", date: "2026-03-29", units: 33, total: 87.8 },
  { productId: "prd-2", productName: "Amoxicilina 500mg", date: "2026-03-25", units: 17, total: 96.9 },
  { productId: "prd-2", productName: "Amoxicilina 500mg", date: "2026-03-26", units: 18, total: 102.6 },
  { productId: "prd-2", productName: "Amoxicilina 500mg", date: "2026-03-27", units: 20, total: 114.0 },
  { productId: "prd-2", productName: "Amoxicilina 500mg", date: "2026-03-28", units: 21, total: 119.7 },
  { productId: "prd-2", productName: "Amoxicilina 500mg", date: "2026-03-29", units: 23, total: 131.1 },
  { productId: "prd-3", productName: "Ibuprofeno 400mg", date: "2026-03-25", units: 22, total: 63.8 },
  { productId: "prd-3", productName: "Ibuprofeno 400mg", date: "2026-03-26", units: 24, total: 69.6 },
  { productId: "prd-3", productName: "Ibuprofeno 400mg", date: "2026-03-27", units: 25, total: 72.5 },
  { productId: "prd-3", productName: "Ibuprofeno 400mg", date: "2026-03-28", units: 27, total: 78.3 },
  { productId: "prd-3", productName: "Ibuprofeno 400mg", date: "2026-03-29", units: 29, total: 84.1 },
];

export function buildMockTimeSeries(metric: TimeSeries["metric"], productId?: string): TimeSeries {
  const filtered = productId ? MOCK_PRODUCT_SALES.filter((item) => item.productId === productId) : MOCK_PRODUCT_SALES;
  const dateMap = new Map<string, number>();

  for (const row of filtered) {
    const key = row.date;
    const value = metric === "sales_units" ? row.units : row.total;
    dateMap.set(key, (dateMap.get(key) ?? 0) + value);
  }

  const points = [...dateMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([timestamp, value]) => ({
      timestamp,
      label: new Date(`${timestamp}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
      value: Number(value.toFixed(2)),
    }));

  return {
    metric,
    granularity: "day",
    points,
  };
}

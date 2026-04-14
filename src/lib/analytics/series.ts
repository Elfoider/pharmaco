import type { TimeSeries, TimeSeriesPoint } from "@/modules/analytics/types";
import type { Sale, SaleItem } from "@/modules/sales/types";

function normalizeDateKey(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

function pointsFromMap(metric: TimeSeries["metric"], pointsMap: Map<string, number>): TimeSeries {
  const points: TimeSeriesPoint[] = [...pointsMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([timestamp, value]) => ({
      timestamp,
      value,
      label: timestamp,
    }));

  return {
    metric,
    granularity: "day",
    points,
  };
}

export function buildDailySalesSeries(sales: Sale[]): TimeSeries {
  const map = new Map<string, number>();

  for (const sale of sales) {
    const key = normalizeDateKey(sale.createdAt);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + Number(sale.total ?? 0));
  }

  return pointsFromMap("sales_amount", map);
}

export function buildDailyUnitsSeries(saleItems: SaleItem[]): TimeSeries {
  const map = new Map<string, number>();

  for (const item of saleItems) {
    const key = normalizeDateKey(item.createdAt);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + Number(item.quantity ?? 0));
  }

  return pointsFromMap("sales_units", map);
}

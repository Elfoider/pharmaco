import { linearRegression, predictNextValue, summarizeTrend } from "@/lib/analytics/math";
import { productsService } from "@/lib/services/products.service";
import { saleItemsService, salesService } from "@/lib/services/sales.service";
import type { AnalyticsPredictionReport } from "@/modules/analytics/types";
import type { Product } from "@/modules/products/types";
import type { Sale, SaleItem } from "@/modules/sales/types";

export type AnalyticsPeriod = "day" | "week" | "month";
export type AnalyticsMetric = "units" | "amount";

export type RegressionInputPoint = {
  x: number;
  y: number;
  label: string;
};

export type ProductTemporalSeries = {
  productId: string;
  productName: string;
  period: AnalyticsPeriod;
  metric: AnalyticsMetric;
  points: RegressionInputPoint[];
};

type GroupedPoint = {
  key: string;
  sortDate: Date;
  label: string;
  value: number;
};

function toPeriodStart(date: Date, period: AnalyticsPeriod) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (period === "month") {
    d.setDate(1);
    return d;
  }

  if (period === "week") {
    const day = d.getDay();
    const diffToMonday = (day + 6) % 7;
    d.setDate(d.getDate() - diffToMonday);
    return d;
  }

  return d;
}

function getWeekNumber(date: Date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  return Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function buildLabel(date: Date, period: AnalyticsPeriod) {
  if (period === "month") {
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  }

  if (period === "week") {
    return `Semana ${getWeekNumber(date)}`;
  }

  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

function toSeries(points: GroupedPoint[]): RegressionInputPoint[] {
  return points
    .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
    .map((point, index) => ({
      x: index + 1,
      y: Number(point.value.toFixed(2)),
      label: point.label,
    }));
}

function toPredictionReport(points: RegressionInputPoint[]): AnalyticsPredictionReport {
  const series = {
    metric: "sales_amount" as const,
    granularity: "day" as const,
    points: points.map((point) => ({
      timestamp: point.label,
      label: point.label,
      value: point.y,
    })),
  };
  const regression = linearRegression(points.map((point) => ({ x: point.x, y: point.y })));
  const nextValue = predictNextValue(series, regression);
  const trend = summarizeTrend(series, nextValue);

  return { series, regression, nextValue, trend };
}

function groupSaleItemsByPeriod(
  items: SaleItem[],
  productMap: Map<string, Product>,
  period: AnalyticsPeriod,
  metric: AnalyticsMetric,
  onlyProductId?: string,
) {
  const grouped = new Map<string, Map<string, GroupedPoint>>();

  for (const item of items) {
    if (onlyProductId && item.productId !== onlyProductId) continue;
    const product = productMap.get(item.productId);
    if (!product) continue;

    const date = new Date(item.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const start = toPeriodStart(date, period);
    const key = start.toISOString().slice(0, 10);
    const label = buildLabel(start, period);
    const value = metric === "units" ? Number(item.quantity ?? 0) : Number(item.lineTotal ?? 0);

    if (!grouped.has(item.productId)) {
      grouped.set(item.productId, new Map());
    }
    const productGroup = grouped.get(item.productId)!;
    const existing = productGroup.get(key);

    if (!existing) {
      productGroup.set(key, { key, sortDate: start, label, value });
    } else {
      existing.value += value;
    }
  }

  return [...grouped.entries()].map(([productId, productPoints]) => ({
    productId,
    productName: productMap.get(productId)?.name ?? productId,
    period,
    metric,
    points: toSeries([...productPoints.values()]),
  }));
}

export const analyticsService = {
  async getProductTemporalSeries(options?: {
    period?: AnalyticsPeriod;
    metric?: AnalyticsMetric;
    productId?: string;
  }): Promise<ProductTemporalSeries[]> {
    const period = options?.period ?? "week";
    const metric = options?.metric ?? "units";
    const [sales, saleItems, products] = await Promise.all([
      salesService.getAll(1000),
      saleItemsService.getAll(4000),
      productsService.getAll(1000),
    ]);

    const activeSaleIds = new Set(sales.map((sale: Sale) => sale.id));
    const filteredItems = saleItems.filter((item) => activeSaleIds.has(item.saleId));
    const productMap = new Map(products.map((product) => [product.id, product]));

    return groupSaleItemsByPeriod(filteredItems, productMap, period, metric, options?.productId);
  },

  async getRegressionInputByProduct(options?: {
    period?: AnalyticsPeriod;
    metric?: AnalyticsMetric;
    productId?: string;
  }): Promise<RegressionInputPoint[]> {
    const series = await this.getProductTemporalSeries(options);
    return series[0]?.points ?? [];
  },

  async getSalesPredictionReport(options?: {
    period?: AnalyticsPeriod;
    productId?: string;
  }): Promise<AnalyticsPredictionReport> {
    const points = await this.getRegressionInputByProduct({
      period: options?.period ?? "week",
      metric: "amount",
      productId: options?.productId,
    });

    return toPredictionReport(points);
  },
};

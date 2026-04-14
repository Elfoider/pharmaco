import type { AnalyticsDataSource } from "@/lib/analytics/data-source";
import { mockAnalyticsDataSource } from "@/lib/analytics/mock-data-source";
import { linearRegression, predictNextValue, summarizeTrend } from "@/lib/analytics/math";
import { buildDailySalesSeries, buildDailyUnitsSeries } from "@/lib/analytics/series";
import { saleItemsService, salesService } from "@/lib/services/sales.service";
import type { AnalyticsPredictionReport } from "@/modules/analytics/types";

function buildReportFromSeries(
  series: ReturnType<typeof buildDailySalesSeries> | ReturnType<typeof buildDailyUnitsSeries>,
): AnalyticsPredictionReport {
  const points = series.points.map((point, index) => ({ x: index, y: point.value }));
  const regression = linearRegression(points);
  const nextValue = predictNextValue(series, regression);
  const trend = summarizeTrend(series, nextValue);

  return {
    series,
    regression,
    nextValue,
    trend,
  };
}

export const firestoreAnalyticsDataSource: AnalyticsDataSource = {
  async getSalesAmountSeries() {
    const sales = await salesService.getAll(180);
    return buildDailySalesSeries(sales);
  },
  async getSalesUnitsSeries() {
    const saleItems = await saleItemsService.getAll(500);
    return buildDailyUnitsSeries(saleItems);
  },
};

export function createAnalyticsService(dataSource: AnalyticsDataSource) {
  return {
    async getSalesPredictionReport(productId?: string): Promise<AnalyticsPredictionReport> {
      const series = await dataSource.getSalesAmountSeries(productId);
      return buildReportFromSeries(series);
    },

    async getUnitsPredictionReport(productId?: string): Promise<AnalyticsPredictionReport> {
      const series = await dataSource.getSalesUnitsSeries(productId);
      return buildReportFromSeries(series);
    },
  };
}

export const mockAnalyticsService = createAnalyticsService(mockAnalyticsDataSource);

/**
 * Fuente activa para fase actual: mock data.
 * Cambiar por `createAnalyticsService(firestoreAnalyticsDataSource)` en producción.
 */
export const analyticsService = mockAnalyticsService;

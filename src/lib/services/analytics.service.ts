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

export const analyticsService = {
  async getSalesPredictionReport(limit = 180): Promise<AnalyticsPredictionReport> {
    const sales = await salesService.getAll(limit);
    const series = buildDailySalesSeries(sales);
    return buildReportFromSeries(series);
  },

  async getUnitsPredictionReport(limit = 500): Promise<AnalyticsPredictionReport> {
    const saleItems = await saleItemsService.getAll(limit);
    const series = buildDailyUnitsSeries(saleItems);
    return buildReportFromSeries(series);
  },
};

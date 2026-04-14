import { buildMockTimeSeries } from "@/lib/mocks/analytics.mock";
import type { AnalyticsDataSource } from "@/lib/analytics/data-source";

export const mockAnalyticsDataSource: AnalyticsDataSource = {
  async getSalesAmountSeries(productId) {
    return buildMockTimeSeries("sales_amount", productId);
  },

  async getSalesUnitsSeries(productId) {
    return buildMockTimeSeries("sales_units", productId);
  },
};

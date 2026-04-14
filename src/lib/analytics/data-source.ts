import type { TimeSeries } from "@/modules/analytics/types";

export type AnalyticsDataSource = {
  getSalesAmountSeries: (productId?: string) => Promise<TimeSeries>;
  getSalesUnitsSeries: (productId?: string) => Promise<TimeSeries>;
};

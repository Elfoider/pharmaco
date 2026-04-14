export type TimeGranularity = "day" | "week" | "month";

export type TimeSeriesPoint = {
  timestamp: string;
  value: number;
  label?: string;
};

export type TimeSeries = {
  metric: "sales_amount" | "sales_units" | "inventory_stock";
  granularity: TimeGranularity;
  points: TimeSeriesPoint[];
};

export type RegressionPoint = {
  x: number;
  y: number;
};

export type LinearRegressionResult = {
  slope: number;
  intercept: number;
  rSquared: number;
  equation: string;
  sampleSize: number;
};

export type PredictionResult = {
  baseIndex: number;
  predictedValue: number;
  confidence: "low" | "medium" | "high";
};

export type TrendDirection = "up" | "down" | "flat";

export type TrendSummary = {
  direction: TrendDirection;
  deltaAbsolute: number;
  deltaPercent: number;
  message: string;
};

export type AnalyticsPredictionReport = {
  series: TimeSeries;
  regression: LinearRegressionResult;
  nextValue: PredictionResult;
  trend: TrendSummary;
};

export type DashboardChartPoint = {
  x: string;
  y: number;
};

export type DashboardChartSeries = {
  id: string;
  label: string;
  colorToken: "cyan" | "blue" | "mint";
  points: DashboardChartPoint[];
};

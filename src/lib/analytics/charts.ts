import type { DashboardChartSeries, TimeSeries } from "@/modules/analytics/types";

function metricLabel(metric: TimeSeries["metric"]) {
  switch (metric) {
    case "sales_amount":
      return "Ventas";
    case "sales_units":
      return "Unidades";
    case "inventory_stock":
      return "Inventario";
    default:
      return "Serie";
  }
}

function metricColor(metric: TimeSeries["metric"]): DashboardChartSeries["colorToken"] {
  switch (metric) {
    case "sales_amount":
      return "cyan";
    case "sales_units":
      return "blue";
    case "inventory_stock":
      return "mint";
    default:
      return "cyan";
  }
}

export function toDashboardChartSeries(series: TimeSeries): DashboardChartSeries {
  return {
    id: `${series.metric}-${series.granularity}`,
    label: metricLabel(series.metric),
    colorToken: metricColor(series.metric),
    points: series.points.map((point) => ({
      x: point.label ?? point.timestamp,
      y: point.value,
    })),
  };
}

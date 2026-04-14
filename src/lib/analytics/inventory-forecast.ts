import { calculateSlopeAndIntercept } from "@/lib/analytics/linear-regression";

export type InventoryConsumptionSample = {
  date: string;
  quantity: number;
};

export type InventoryForecast = {
  stockCurrent: number;
  averageDailyConsumption: number;
  trend: "up" | "down" | "flat";
  estimatedDaysToStockout: number | null;
  estimatedWeeksToStockout: number | null;
  estimatedStockoutDate: string | null;
  message: string;
};

function startOfDay(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function toDailySeries(samples: InventoryConsumptionSample[], lookbackDays: number) {
  const end = startOfDay(new Date());
  const start = new Date(end);
  start.setDate(start.getDate() - (lookbackDays - 1));

  const map = new Map<string, number>();

  for (let i = 0; i < lookbackDays; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    map.set(day.toISOString().slice(0, 10), 0);
  }

  for (const sample of samples) {
    const day = startOfDay(new Date(sample.date));
    if (Number.isNaN(day.getTime())) continue;
    if (day < start || day > end) continue;
    const key = day.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + Math.max(0, sample.quantity));
  }

  return [...map.entries()].map(([date, quantity], index) => ({ x: index, y: quantity, date }));
}

export function estimateInventoryStockout(
  stockCurrent: number,
  samples: InventoryConsumptionSample[],
  lookbackDays = 30,
): InventoryForecast {
  const safeStock = Math.max(0, Number(stockCurrent) || 0);
  const dailySeries = toDailySeries(samples, Math.max(7, lookbackDays));
  const consumedTotal = dailySeries.reduce((sum, point) => sum + point.y, 0);
  const averageDailyConsumption = consumedTotal / dailySeries.length;

  if (safeStock <= 0) {
    return {
      stockCurrent: safeStock,
      averageDailyConsumption,
      trend: "down",
      estimatedDaysToStockout: 0,
      estimatedWeeksToStockout: 0,
      estimatedStockoutDate: new Date().toISOString().slice(0, 10),
      message: "Stock agotado actualmente.",
    };
  }

  if (consumedTotal <= 0) {
    return {
      stockCurrent: safeStock,
      averageDailyConsumption: 0,
      trend: "flat",
      estimatedDaysToStockout: null,
      estimatedWeeksToStockout: null,
      estimatedStockoutDate: null,
      message: "Sin consumo histórico suficiente para estimar agotamiento.",
    };
  }

  let slope = 0;
  try {
    const model = calculateSlopeAndIntercept(dailySeries);
    slope = model.slope;
  } catch {
    slope = 0;
  }

  const trend: InventoryForecast["trend"] = slope > 0.1 ? "up" : slope < -0.1 ? "down" : "flat";
  const adjustedDailyConsumption = Math.max(0.01, averageDailyConsumption + Math.max(-averageDailyConsumption * 0.6, slope));
  const daysToStockoutRaw = safeStock / adjustedDailyConsumption;
  const estimatedDaysToStockout = Number.isFinite(daysToStockoutRaw) ? Math.ceil(daysToStockoutRaw) : null;
  const estimatedWeeksToStockout = estimatedDaysToStockout ? Number((estimatedDaysToStockout / 7).toFixed(1)) : null;

  const stockoutDate = estimatedDaysToStockout ? new Date() : null;
  if (stockoutDate && estimatedDaysToStockout) {
    stockoutDate.setDate(stockoutDate.getDate() + estimatedDaysToStockout);
  }

  return {
    stockCurrent: safeStock,
    averageDailyConsumption,
    trend,
    estimatedDaysToStockout,
    estimatedWeeksToStockout,
    estimatedStockoutDate: stockoutDate ? stockoutDate.toISOString().slice(0, 10) : null,
    message:
      estimatedDaysToStockout && estimatedDaysToStockout <= 21
        ? "Riesgo de quiebre en corto plazo."
        : "Estimación orientativa basada en consumo histórico.",
  };
}

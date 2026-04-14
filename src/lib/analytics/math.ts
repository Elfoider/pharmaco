import type {
  LinearRegressionResult,
  PredictionResult,
  RegressionPoint,
  TimeSeries,
  TrendSummary,
} from "@/modules/analytics/types";

function safeDiv(numerator: number, denominator: number) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

export function linearRegression(points: RegressionPoint[]): LinearRegressionResult {
  if (points.length < 2) {
    return {
      slope: 0,
      intercept: points[0]?.y ?? 0,
      rSquared: 0,
      equation: "y = 0x + 0",
      sampleSize: points.length,
    };
  }

  const n = points.length;
  const sumX = points.reduce((acc, point) => acc + point.x, 0);
  const sumY = points.reduce((acc, point) => acc + point.y, 0);
  const sumXY = points.reduce((acc, point) => acc + point.x * point.y, 0);
  const sumX2 = points.reduce((acc, point) => acc + point.x * point.x, 0);

  const slope = safeDiv(n * sumXY - sumX * sumY, n * sumX2 - sumX * sumX);
  const intercept = safeDiv(sumY - slope * sumX, n);

  const meanY = safeDiv(sumY, n);
  const ssTot = points.reduce((acc, point) => acc + (point.y - meanY) ** 2, 0);
  const ssRes = points.reduce((acc, point) => acc + (point.y - (slope * point.x + intercept)) ** 2, 0);
  const rSquared = ssTot === 0 ? 0 : Math.max(0, 1 - ssRes / ssTot);

  return {
    slope,
    intercept,
    rSquared,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    sampleSize: n,
  };
}

function getConfidence(rSquared: number): PredictionResult["confidence"] {
  if (rSquared >= 0.7) return "high";
  if (rSquared >= 0.35) return "medium";
  return "low";
}

export function predictNextValue(series: TimeSeries, regression?: LinearRegressionResult): PredictionResult {
  const model =
    regression ??
    linearRegression(series.points.map((point, index) => ({ x: index, y: point.value })));
  const baseIndex = series.points.length;
  const predictedValue = Math.max(0, model.slope * baseIndex + model.intercept);

  return {
    baseIndex,
    predictedValue,
    confidence: getConfidence(model.rSquared),
  };
}

export function summarizeTrend(series: TimeSeries, nextPrediction: PredictionResult): TrendSummary {
  const currentValue = series.points.at(-1)?.value ?? 0;
  const deltaAbsolute = nextPrediction.predictedValue - currentValue;
  const deltaPercent = currentValue === 0 ? 0 : (deltaAbsolute / currentValue) * 100;

  const direction: TrendSummary["direction"] =
    Math.abs(deltaPercent) < 1 ? "flat" : deltaPercent > 0 ? "up" : "down";

  const readableDelta = `${Math.abs(deltaPercent).toFixed(1)}%`;
  const messageByDirection = {
    up: `Tendencia alcista estimada (${readableDelta}).`,
    down: `Tendencia bajista estimada (${readableDelta}).`,
    flat: "Tendencia estable para el siguiente período.",
  } as const;

  return {
    direction,
    deltaAbsolute,
    deltaPercent,
    message: messageByDirection[direction],
  };
}

export type RegressionDataPoint = {
  x: number;
  y: number;
};

export type RegressionTrend = "up" | "down" | "flat";

export type LinearRegressionCoefficients = {
  slope: number;
  intercept: number;
};

export type LinearRegressionPrediction = LinearRegressionCoefficients & {
  predictedValue: number;
  trend: RegressionTrend;
};

function assertValidDataset(data: RegressionDataPoint[]) {
  if (!Array.isArray(data) || data.length < 2) {
    throw new Error("Se requieren al menos 2 puntos válidos para regresión lineal.");
  }

  for (const point of data) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      throw new Error("El dataset contiene valores no numéricos o inválidos.");
    }
  }
}

function safeDivide(numerator: number, denominator: number) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    throw new Error("No se pudo calcular regresión lineal por división inválida.");
  }
  return numerator / denominator;
}

/**
 * Calcula pendiente (m) e intercepto (b) del modelo y = mx + b.
 */
export function calculateSlopeAndIntercept(data: RegressionDataPoint[]): LinearRegressionCoefficients {
  assertValidDataset(data);

  const n = data.length;
  const sumX = data.reduce((acc, point) => acc + point.x, 0);
  const sumY = data.reduce((acc, point) => acc + point.y, 0);
  const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
  const sumX2 = data.reduce((acc, point) => acc + point.x ** 2, 0);

  const slope = safeDivide(n * sumXY - sumX * sumY, n * sumX2 - sumX ** 2);
  const intercept = safeDivide(sumY - slope * sumX, n);

  return { slope, intercept };
}

/**
 * Predice y para un valor futuro de x usando y = mx + b.
 */
export function predictFutureValue(model: LinearRegressionCoefficients, futureX: number): LinearRegressionPrediction {
  if (!Number.isFinite(futureX)) {
    throw new Error("futureX debe ser un número válido.");
  }

  const predictedValue = model.slope * futureX + model.intercept;
  const epsilon = 1e-9;
  const trend: RegressionTrend =
    model.slope > epsilon ? "up" : model.slope < -epsilon ? "down" : "flat";

  return {
    slope: model.slope,
    intercept: model.intercept,
    predictedValue,
    trend,
  };
}

/**
 * Genera una serie de predicción para los próximos N pasos.
 */
export function generatePredictionSeries(
  model: LinearRegressionCoefficients,
  startX: number,
  steps: number,
): Array<{ x: number; y: number }> {
  if (!Number.isFinite(startX)) {
    throw new Error("startX debe ser un número válido.");
  }
  if (!Number.isInteger(steps) || steps <= 0) {
    throw new Error("steps debe ser un entero positivo.");
  }

  return Array.from({ length: steps }, (_, index) => {
    const x = startX + index;
    const y = model.slope * x + model.intercept;
    return { x, y };
  });
}

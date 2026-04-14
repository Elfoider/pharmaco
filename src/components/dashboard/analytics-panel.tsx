"use client";

import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { toDashboardChartSeries } from "@/lib/analytics/charts";
import { analyticsService } from "@/lib/services/analytics.service";
import type { AnalyticsPredictionReport } from "@/modules/analytics/types";

function colorClass(token: "cyan" | "blue" | "mint") {
  return {
    cyan: "text-cyan-200",
    blue: "text-blue-200",
    mint: "text-emerald-200",
  }[token];
}

function Sparkline({ values }: { values: number[] }) {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-20 w-full">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

export function AnalyticsPanel({ report }: { report?: AnalyticsPredictionReport | null }) {
  const [serviceReport, setServiceReport] = useState<AnalyticsPredictionReport | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (report) return;
    let active = true;

    void analyticsService
      .getSalesPredictionReport()
      .then((result) => {
        if (active) {
          setServiceReport(result);
        }
      })
      .catch(() => {
        if (active) {
          setHasError(true);
        }
      });

    return () => {
      active = false;
    };
  }, [report]);

  const activeReport = report ?? serviceReport;

  if (!activeReport) {
    return (
        <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-4 text-sm text-slate-300">
          {hasError ? "No fue posible cargar la analítica desde Firestore." : "Cargando analítica predictiva..."}
        </section>
      );
  }

  const chartSeries = toDashboardChartSeries(activeReport.series);
  const metricValues = chartSeries.points.map((point) => point.y);
  const isUp = activeReport.trend.direction !== "down";

  if (!chartSeries.points.length) {
    return (
      <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-4 text-sm text-slate-300">
        No hay datos históricos suficientes en Firestore para construir la predicción.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-cyan-200" />
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">Predictive Analytics</h3>
        </div>
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
          Regresión lineal simple
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div>
          <p className="text-xs text-slate-400">{chartSeries.label} (serie diaria)</p>
          <div className={`mt-2 ${colorClass(chartSeries.colorToken)}`}>
            <Sparkline values={metricValues} />
          </div>
          <p className="mt-2 text-xs text-slate-300">{activeReport.trend.message}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-slate-200">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Próximo valor estimado</p>
          <p className="mt-1 text-xl font-semibold text-cyan-100">{activeReport.nextValue.predictedValue.toFixed(2)}</p>
          <p className="mt-1 text-xs text-slate-300">Confianza: {activeReport.nextValue.confidence}</p>
          <p className="mt-3 text-xs text-slate-400">Modelo: {activeReport.regression.equation}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-300">
            {isUp ? <TrendingUp className="h-3.5 w-3.5 text-emerald-300" /> : <TrendingDown className="h-3.5 w-3.5 text-rose-300" />}
            Δ {activeReport.trend.deltaPercent.toFixed(1)}%
          </p>
        </div>
      </div>
    </section>
  );
}

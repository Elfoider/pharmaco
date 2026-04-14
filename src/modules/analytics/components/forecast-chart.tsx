"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils/cn";

export type ForecastChartDatum = {
  label: string;
  historical: number | null;
  prediction: number | null;
};

type ForecastChartProps = {
  data: ForecastChartDatum[];
  title?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  className?: string;
};

export function ForecastChart({
  data,
  title = "Pronóstico",
  yAxisLabel = "Valor",
  xAxisLabel = "Periodo",
  className,
}: ForecastChartProps) {
  return (
    <section className={cn("rounded-2xl border border-cyan-300/20 bg-slate-950/55 p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">{title}</h3>
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
          Histórico vs Predicción
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 10, left: 6, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
              label={{ value: xAxisLabel, position: "insideBottom", dy: 10, fill: "#94a3b8" }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", dx: -8, fill: "#94a3b8" }}
            />
            <Tooltip
              cursor={{ stroke: "rgba(34, 211, 238, 0.35)", strokeWidth: 1 }}
              contentStyle={{
                background: "rgba(2, 6, 23, 0.95)",
                border: "1px solid rgba(148, 163, 184, 0.28)",
                borderRadius: "12px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#bae6fd", fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />

            <Line
              type="monotone"
              name="Histórico"
              dataKey="historical"
              stroke="#22d3ee"
              strokeWidth={2.5}
              dot={{ r: 2 }}
              connectNulls={false}
              isAnimationActive
            />
            <Line
              type="monotone"
              name="Predicción"
              dataKey="prediction"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ r: 2 }}
              strokeDasharray="6 4"
              connectNulls={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

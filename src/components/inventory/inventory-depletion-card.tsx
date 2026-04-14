import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

import type { InventoryForecast } from "@/lib/analytics/inventory-forecast";

type InventoryDepletionCardProps = {
  forecast: InventoryForecast | null;
  productName?: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "Sin estimación";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InventoryDepletionCard({ forecast, productName }: InventoryDepletionCardProps) {
  if (!forecast) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
        Selecciona un producto para proyectar su agotamiento estimado.
      </div>
    );
  }

  const trendTone =
    forecast.trend === "up"
      ? "text-rose-100 border-rose-300/35 bg-rose-400/15"
      : forecast.trend === "down"
        ? "text-emerald-100 border-emerald-300/35 bg-emerald-400/15"
        : "text-slate-100 border-slate-300/35 bg-slate-400/15";

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
          Predicción operativa de inventario
        </h2>
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
          {productName ?? "Producto"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Stock actual</p>
          <p className="mt-1 text-xl font-semibold text-cyan-100">{forecast.stockCurrent}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Consumo promedio/día</p>
          <p className="mt-1 text-xl font-semibold text-cyan-100">{forecast.averageDailyConsumption.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Tendencia</p>
          <p className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${trendTone}`}>
            {forecast.trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {forecast.trend === "up" ? "Consumo en alza" : forecast.trend === "down" ? "Consumo a la baja" : "Consumo estable"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Agotamiento estimado</p>
          <p className="mt-1 text-sm font-semibold text-cyan-100">
            {forecast.estimatedDaysToStockout === null
              ? "Sin datos suficientes"
              : `${forecast.estimatedDaysToStockout} días (~${forecast.estimatedWeeksToStockout} semanas)`}
          </p>
          <p className="text-xs text-slate-400">{formatDate(forecast.estimatedStockoutDate)}</p>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-xs text-amber-100">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {forecast.message}
      </p>
    </section>
  );
}

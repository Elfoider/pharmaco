import { TrendingUp } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";

type SummaryCardProps = {
  label: string;
  value: string;
  delta: string;
};

export function SummaryCard({ label, value, delta }: SummaryCardProps) {
  return (
    <GlassPanel className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      <p className="inline-flex items-center gap-1 text-xs text-emerald-300">
        <TrendingUp className="h-3.5 w-3.5" /> {delta}
      </p>
    </GlassPanel>
  );
}

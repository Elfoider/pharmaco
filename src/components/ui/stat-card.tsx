import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { GlassPanel } from "@/components/ui/glass-panel";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  className?: string;
};

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <GlassPanel className={cn("space-y-3", className)}>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold text-slate-50">{value}</p>
        <ArrowUpRight className="h-4 w-4 text-cyan-300" />
      </div>
      <p className="text-xs text-slate-300/90">{hint}</p>
    </GlassPanel>
  );
}

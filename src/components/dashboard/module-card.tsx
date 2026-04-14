import type { LucideIcon } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusChip } from "@/components/ui/status-chip";

type ModuleCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  status: string;
};

export function ModuleCard({ title, description, icon: Icon, status }: ModuleCardProps) {
  return (
    <GlassPanel className="flex h-full flex-col justify-between space-y-3 border-white/10 bg-white/[0.03]">
      <div className="space-y-2">
        <Icon className="h-5 w-5 text-cyan-300" />
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-300/90">{description}</p>
      </div>
      <StatusChip tone="info">{status}</StatusChip>
    </GlassPanel>
  );
}

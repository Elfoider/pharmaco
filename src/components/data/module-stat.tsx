import { GlassPanel } from "@/components/ui/glass-panel";

type ModuleStatProps = {
  label: string;
  value: string;
};

export function ModuleStat({ label, value }: ModuleStatProps) {
  return (
    <GlassPanel className="space-y-2 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="text-xl font-semibold text-slate-100">{value}</p>
    </GlassPanel>
  );
}

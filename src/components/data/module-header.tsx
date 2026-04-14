import { StatusChip } from "@/components/ui/status-chip";

type ModuleHeaderProps = {
  title: string;
  subtitle: string;
  badge?: string;
};

export function ModuleHeader({ title, subtitle, badge = "Base module" }: ModuleHeaderProps) {
  return (
    <header className="space-y-2">
      <StatusChip tone="info">{badge}</StatusChip>
      <h1 className="text-2xl font-semibold text-slate-50">{title}</h1>
      <p className="text-sm text-slate-300/90">{subtitle}</p>
    </header>
  );
}

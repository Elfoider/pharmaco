import { FolderSearch } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <GlassPanel className="flex flex-col items-center justify-center gap-3 p-10 text-center">
      <FolderSearch className="h-8 w-8 text-cyan-300" />
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <p className="max-w-xl text-sm text-slate-300/90">{description}</p>
    </GlassPanel>
  );
}

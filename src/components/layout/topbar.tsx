import { Bell, Search } from "lucide-react";

import { PharmacoMark } from "@/components/branding/pharmaco-mark";
import { GlassPanel } from "@/components/ui/glass-panel";

export function TopBar() {
  return (
    <GlassPanel className="flex items-center justify-between gap-4 px-4 py-3">
      <PharmacoMark />
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 md:flex">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Buscar módulos, procesos o reportes…</span>
        </div>
        <button className="rounded-xl border border-white/10 bg-slate-950/40 p-2 text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </GlassPanel>
  );
}

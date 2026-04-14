import { Pill, ShieldCheck } from "lucide-react";

export function PharmacoLogo() {
  return (
    <div className="inline-flex items-center gap-2.5 text-cyan-300">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10">
        <Pill className="h-4 w-4" />
        <ShieldCheck className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full bg-slate-950 p-0.5 text-cyan-300" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-wide text-cyan-200">PHARMACO</p>
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Management & Control</p>
      </div>
    </div>
  );
}

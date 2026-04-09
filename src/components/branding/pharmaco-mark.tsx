import { Pill, Orbit, ShieldCheck } from "lucide-react";

export function PharmacoMark() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
        <Pill className="h-4 w-4 text-cyan-200" />
        <ShieldCheck className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full bg-slate-950 p-0.5 text-cyan-300" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-wide text-slate-50">PHARMACO</p>
        <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">
          <Orbit className="h-3 w-3" /> Management & Control
        </p>
      </div>
    </div>
  );
}

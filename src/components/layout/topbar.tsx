"use client";

import { Bell, Search } from "lucide-react";

import { PharmacoMark } from "@/components/branding/pharmaco-mark";
import { clearClientSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export function TopBar({ role }: { role: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-[0_14px_42px_rgba(2,6,23,0.42)] backdrop-blur-lg">
      <PharmacoMark />
      <div className="flex items-center gap-3">
        <span className="hidden rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-300 md:inline-flex">
          Rol activo: {role}
        </span>
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 md:flex">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Buscar módulos...</span>
        </div>
        <button className="rounded-xl border border-white/10 bg-slate-950/40 p-2 text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200">
          <Bell className="h-4 w-4" />
        </button>
        <Button
          className="h-9 px-3 text-xs"
          onClick={() => {
            clearClientSession();
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

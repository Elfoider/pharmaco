"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Pill, Shield } from "lucide-react";
import { useState } from "react";

import { LoginCursorGlow } from "@/components/auth/login-cursor-glow";
import { LoginForm } from "@/components/auth/login-form";
import { StatusChip } from "@/components/ui/status-chip";

export function LoginPageShell() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-8"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
    >
      <LoginCursorGlow x={cursor.x} y={cursor.y} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-6"
        >
          <StatusChip tone="info">Pharma SaaS Platform</StatusChip>

          <div className="space-y-2">
            <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
              <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">PHARMACO</span>
            </h1>
            <p className="text-lg text-slate-300">Pharmaceutical Management &amp; Control</p>
          </div>

          <p className="max-w-xl text-sm text-slate-300/90 sm:text-base">
            Plataforma administrativa farmacéutica con enfoque corporativo, control operacional y experiencia premium.
          </p>

          <div className="grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <Shield className="mb-2 h-5 w-5 text-cyan-300" />
              <p className="text-sm font-medium text-slate-100">Seguridad centralizada</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <Pill className="mb-2 h-5 w-5 text-cyan-300" />
              <p className="text-sm font-medium text-slate-100">Gestión farmacéutica</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <Cpu className="mb-2 h-5 w-5 text-cyan-300" />
              <p className="text-sm font-medium text-slate-100">Arquitectura escalable</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <Activity className="mb-2 h-5 w-5 text-cyan-300" />
              <p className="text-sm font-medium text-slate-100">Operación en tiempo real</p>
            </div>
          </div>
        </motion.div>

        <LoginForm />
      </div>
    </section>
  );
}

"use client";

import { z } from "zod";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginValues) {
    setServerMessage(null);
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      if (fieldErrors.email?.[0]) setError("email", { message: fieldErrors.email[0] });
      if (fieldErrors.password?.[0]) setError("password", { message: fieldErrors.password[0] });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1200));
    setServerMessage("Demo mode: autenticación mock completada correctamente.");
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <GlassPanel className="space-y-5">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/90">
            <ShieldCheck className="h-3.5 w-3.5" /> Acceso seguro
          </p>
          <h2 className="text-2xl font-semibold text-slate-50">Iniciar sesión</h2>
          <p className="text-sm text-slate-300/90">Ingresa con tus credenciales corporativas.</p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Correo institucional
            <div className="mt-1.5 relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="nombre@pharmaco.com"
                className="pl-9"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
          </label>

          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Contraseña
            <div className="mt-1.5 relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-9"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
          </label>

          {serverMessage ? (
            <p className="rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
              {serverMessage}
            </p>
          ) : null}

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Acceder al panel
          </Button>
        </form>
      </GlassPanel>
    </motion.div>
  );
}

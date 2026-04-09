"use client";

import { motion } from "framer-motion";
import { LockKeyhole, Mail, UserCog } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { auth } from "@/lib/firebase/client";
import { setClientSession } from "@/lib/auth/session";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { USER_ROLES } from "@/lib/auth/roles";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PharmacoLogo } from "@/components/branding/pharmaco-logo";

export function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      role: "admin",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null);

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten();

      if (fieldErrors.email?.[0]) {
        setError("email", { message: fieldErrors.email[0] });
      }

      if (fieldErrors.password?.[0]) {
        setError("password", { message: fieldErrors.password[0] });
      }

      if (fieldErrors.role?.[0]) {
        setError("role", { message: fieldErrors.role[0] });
      }

      return;
    }

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      setClientSession(values.role);
      router.push("/dashboard");
    } catch {
      setAuthError("No fue posible iniciar sesión. Verifica credenciales o permisos.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md"
    >
      <Card className="space-y-6">
        <div className="space-y-4">
          <PharmacoLogo />
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">Control administrativo farmacéutico</h1>
            <p className="mt-1 text-sm text-slate-300/90">
              Ingresa para operar PHARMACO con seguridad, trazabilidad y control por roles.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Correo corporativo</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="usuario@pharmaco.com"
                autoComplete="email"
                className="pl-9"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Contraseña</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="pl-9"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Rol operativo</label>
            <div className="relative">
              <UserCog className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                className="h-11 w-full appearance-none rounded-xl border border-white/15 bg-slate-950/50 pl-9 pr-3 text-sm text-slate-50 outline-none ring-cyan-400/30 transition focus:border-cyan-300 focus:ring-4"
                {...register("role")}
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            {errors.role?.message ? <p className="text-xs text-rose-300">{errors.role.message}</p> : null}
          </div>

          {authError ? (
            <p className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{authError}</p>
          ) : null}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Iniciar sesión
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}

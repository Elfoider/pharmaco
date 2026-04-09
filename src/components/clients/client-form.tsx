"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Client } from "@/lib/domain/types";
import { clientSchema, type ClientFormValues } from "@/lib/validations/client";

type ClientFormProps = {
  mode: "create" | "edit";
  initialClient?: Client | null;
  onCancel: () => void;
  onSubmitClient: (values: ClientFormValues) => Promise<void>;
};

export function ClientForm({ mode, initialClient, onCancel, onSubmitClient }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    defaultValues: {
      code: "",
      clientType: "persona",
      fullName: "",
      documentId: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!initialClient) {
      reset({
        code: "",
        clientType: "persona",
        fullName: "",
        documentId: "",
        phone: "",
        email: "",
        address: "",
      });
      return;
    }

    reset({
      code: initialClient.code,
      clientType: initialClient.clientType,
      fullName: initialClient.fullName,
      documentId: initialClient.documentId || "",
      phone: initialClient.phone || "",
      email: initialClient.email || "",
      address: initialClient.address || "",
    });
  }, [initialClient, reset]);

  async function onSubmit(values: ClientFormValues) {
    const parsed = clientSchema.safeParse(values);

    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      if (fields.code?.[0]) setError("code", { message: fields.code[0] });
      if (fields.fullName?.[0]) setError("fullName", { message: fields.fullName[0] });
      if (fields.email?.[0]) setError("email", { message: fields.email[0] });
      if (fields.phone?.[0]) setError("phone", { message: fields.phone[0] });
      if (fields.documentId?.[0]) setError("documentId", { message: fields.documentId[0] });
      if (fields.address?.[0]) setError("address", { message: fields.address[0] });
      return;
    }

    await onSubmitClient(parsed.data);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Código (CLI-001)" error={errors.code?.message} {...register("code")} />
        <select
          className="h-11 w-full rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none transition focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
          {...register("clientType")}
        >
          <option value="persona">Persona</option>
          <option value="empresa">Empresa</option>
        </select>
      </div>

      <Input placeholder="Nombre completo" error={errors.fullName?.message} {...register("fullName")} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Documento" error={errors.documentId?.message} {...register("documentId")} />
        <Input placeholder="Teléfono" error={errors.phone?.message} {...register("phone")} />
      </div>

      <Input placeholder="Correo" error={errors.email?.message} {...register("email")} />
      <Input placeholder="Dirección" error={errors.address?.message} {...register("address")} />

      <div className="flex justify-end gap-2">
        <Button type="button" className="bg-slate-700 text-slate-100 hover:bg-slate-600" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Crear cliente" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

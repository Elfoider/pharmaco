"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Client } from "@/modules/clients/types";
import { clientSchema, type ClientFormValues } from "@/lib/validations/client";

type ClientFormProps = {
  mode: "create" | "edit";
  initialClient?: Client | null;
  onCancel: () => void;
  onSubmitClient: (values: ClientFormValues) => Promise<void>;
};

const emptyValues: ClientFormValues = {
  name: "",
  document: "",
  phone: "",
  email: "",
  address: "",
  birthDate: "",
  notes: "",
};

export function ClientForm({ mode, initialClient, onCancel, onSubmitClient }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({ defaultValues: emptyValues });

  useEffect(() => {
    if (!initialClient) {
      reset(emptyValues);
      return;
    }

    reset({
      name: initialClient.name,
      document: initialClient.document,
      phone: initialClient.phone,
      email: initialClient.email || "",
      address: initialClient.address || "",
      birthDate: initialClient.birthDate || "",
      notes: initialClient.notes || "",
    });
  }, [initialClient, reset]);

  async function onSubmit(values: ClientFormValues) {
    const parsed = clientSchema.safeParse(values);

    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      if (fields.name?.[0]) setError("name", { message: fields.name[0] });
      if (fields.document?.[0]) setError("document", { message: fields.document[0] });
      if (fields.phone?.[0]) setError("phone", { message: fields.phone[0] });
      if (fields.email?.[0]) setError("email", { message: fields.email[0] });
      if (fields.address?.[0]) setError("address", { message: fields.address[0] });
      if (fields.notes?.[0]) setError("notes", { message: fields.notes[0] });
      return;
    }

    await onSubmitClient(parsed.data);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Nombre" error={errors.name?.message} {...register("name")} />
        <Input placeholder="Documento" error={errors.document?.message} {...register("document")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Teléfono" error={errors.phone?.message} {...register("phone")} />
        <Input placeholder="Correo" error={errors.email?.message} {...register("email")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Dirección" error={errors.address?.message} {...register("address")} />
        <Input type="date" error={errors.birthDate?.message} {...register("birthDate")} />
      </div>

      <div className="space-y-1.5">
        <textarea
          rows={3}
          placeholder="Notas"
          className="w-full rounded-xl border border-white/15 bg-slate-950/65 px-3 py-2 text-sm text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
          {...register("notes")}
        />
        {errors.notes?.message ? <p className="text-xs text-rose-300">{errors.notes.message}</p> : null}
      </div>

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

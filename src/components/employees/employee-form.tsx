"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/modules/employees/types";
import { USER_ROLES } from "@/lib/auth/roles";
import { employeeSchema, type EmployeeFormValues } from "@/lib/validations/employee";

type EmployeeFormProps = {
  mode: "create" | "edit";
  initialEmployee?: Employee | null;
  onCancel: () => void;
  onSubmitEmployee: (values: EmployeeFormValues) => Promise<void>;
};

const emptyValues: EmployeeFormValues = {
  name: "",
  document: "",
  phone: "",
  email: "",
  role: "cajero",
  cargo: "",
  status: "active",
  joinDate: "",
  branchId: "",
};

export function EmployeeForm({ mode, initialEmployee, onCancel, onSubmitEmployee }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({ defaultValues: emptyValues });

  useEffect(() => {
    if (!initialEmployee) {
      reset(emptyValues);
      return;
    }

    reset({
      name: initialEmployee.name,
      document: initialEmployee.document,
      phone: initialEmployee.phone,
      email: initialEmployee.email || "",
      role: initialEmployee.role,
      cargo: initialEmployee.cargo,
      status: initialEmployee.status === "inactive" ? "inactive" : "active",
      joinDate: initialEmployee.joinDate,
      branchId: initialEmployee.branchId,
    });
  }, [initialEmployee, reset]);

  async function onSubmit(values: EmployeeFormValues) {
    const parsed = employeeSchema.safeParse(values);

    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      if (fields.name?.[0]) setError("name", { message: fields.name[0] });
      if (fields.document?.[0]) setError("document", { message: fields.document[0] });
      if (fields.phone?.[0]) setError("phone", { message: fields.phone[0] });
      if (fields.email?.[0]) setError("email", { message: fields.email[0] });
      if (fields.cargo?.[0]) setError("cargo", { message: fields.cargo[0] });
      if (fields.joinDate?.[0]) setError("joinDate", { message: fields.joinDate[0] });
      if (fields.branchId?.[0]) setError("branchId", { message: fields.branchId[0] });
      return;
    }

    await onSubmitEmployee(parsed.data);
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
        <select
          className="h-11 w-full rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none transition focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
          {...register("role")}
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <Input placeholder="Cargo" error={errors.cargo?.message} {...register("cargo")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <select
          className="h-11 w-full rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 outline-none transition focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
          {...register("status")}
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <Input type="date" error={errors.joinDate?.message} {...register("joinDate")} />
        <Input placeholder="branchId" error={errors.branchId?.message} {...register("branchId")} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" className="bg-slate-700 text-slate-100 hover:bg-slate-600" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Crear empleado" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

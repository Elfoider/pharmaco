import { z } from "zod";

import { USER_ROLES } from "@/lib/auth/roles";

export const employeeSchema = z.object({
  name: z.string().min(3, "Nombre requerido").max(120, "Nombre demasiado largo"),
  document: z.string().min(5, "Documento requerido").max(30, "Documento demasiado largo"),
  phone: z.string().min(7, "Teléfono requerido").max(20, "Teléfono demasiado largo"),
  email: z.email("Correo inválido").optional().or(z.literal("")),
  role: z.enum(USER_ROLES),
  cargo: z.string().min(2, "Cargo requerido").max(80, "Cargo demasiado largo"),
  status: z.enum(["active", "inactive"]),
  joinDate: z.string().min(4, "Fecha de ingreso requerida"),
  branchId: z.string().min(2, "Sucursal requerida").max(40, "Sucursal demasiado larga"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

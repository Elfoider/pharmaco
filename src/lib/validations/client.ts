import { z } from "zod";

export const clientSchema = z.object({
  code: z
    .string()
    .min(3, "Código requerido")
    .max(24, "Código demasiado largo")
    .regex(/^[A-Z0-9-]+$/, "Solo mayúsculas, números y guion"),
  clientType: z.enum(["persona", "empresa"]),
  fullName: z.string().min(3, "Nombre requerido").max(120, "Nombre demasiado largo"),
  documentId: z.string().max(30, "Documento demasiado largo").optional().or(z.literal("")),
  phone: z.string().max(20, "Teléfono demasiado largo").optional().or(z.literal("")),
  email: z.email("Correo inválido").optional().or(z.literal("")),
  address: z.string().max(200, "Dirección demasiado larga").optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

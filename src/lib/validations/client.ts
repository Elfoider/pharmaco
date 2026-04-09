import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(3, "Nombre requerido").max(120, "Nombre demasiado largo"),
  document: z.string().min(5, "Documento requerido").max(30, "Documento demasiado largo"),
  phone: z.string().min(7, "Teléfono requerido").max(20, "Teléfono demasiado largo"),
  email: z.email("Correo inválido").optional().or(z.literal("")),
  address: z.string().max(200, "Dirección demasiado larga").optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  notes: z.string().max(400, "Notas demasiado largas").optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

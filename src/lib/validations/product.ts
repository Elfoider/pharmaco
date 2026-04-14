import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nombre requerido").max(120, "Nombre demasiado largo"),
  genericName: z.string().min(2, "Nombre genérico requerido").max(120, "Nombre genérico demasiado largo"),
  barcode: z.string().min(4, "Código de barras requerido").max(40, "Código de barras demasiado largo"),
  sku: z.string().min(3, "SKU requerido").max(40, "SKU demasiado largo"),
  category: z.string().min(2, "Categoría requerida").max(60, "Categoría demasiado larga"),
  laboratory: z.string().min(2, "Laboratorio requerido").max(100, "Laboratorio demasiado largo"),
  requiresPrescription: z.boolean(),
  controlled: z.boolean(),
  costPrice: z.number().min(0, "Costo inválido"),
  salePrice: z.number().min(0, "Precio inválido"),
  stock: z.number().min(0, "Stock inválido"),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

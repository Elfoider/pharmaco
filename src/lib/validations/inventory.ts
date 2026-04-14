import { z } from "zod";

export const inventoryEntrySchema = z.object({
  productId: z.string().min(1, "Producto requerido"),
  lotNumber: z.string().min(2, "Lote requerido").max(64, "Lote demasiado largo"),
  expiryDate: z.string().min(1, "Fecha de vencimiento requerida"),
  quantity: z.number().int().positive("Cantidad inválida"),
  branchId: z.string().min(1, "Sucursal requerida").max(40, "Sucursal demasiado larga"),
  reason: z.string().min(3, "Motivo requerido").max(160, "Motivo demasiado largo"),
});

export const inventoryAdjustmentSchema = z.object({
  productId: z.string().min(1, "Producto requerido"),
  batchId: z.string().min(1, "Lote requerido"),
  quantity: z.number().int().refine((value) => value !== 0, "El ajuste no puede ser 0"),
  reason: z.string().min(3, "Motivo requerido").max(160, "Motivo demasiado largo"),
});

export type InventoryEntryValues = z.infer<typeof inventoryEntrySchema>;
export type InventoryAdjustmentValues = z.infer<typeof inventoryAdjustmentSchema>;

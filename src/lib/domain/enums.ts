export const DOC_STATUS = ["active", "inactive", "archived"] as const;
export type DocStatus = (typeof DOC_STATUS)[number];

export const EMPLOYEE_TYPES = ["interno", "externo"] as const;
export type EmployeeType = (typeof EMPLOYEE_TYPES)[number];

export const CLIENT_TYPES = ["persona", "empresa"] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

export const PRODUCT_CATEGORIES = [
  "medicamento",
  "insumo",
  "dispositivo",
  "cuidado_personal",
  "otro",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const INVENTORY_MOVEMENT_TYPES = [
  "entrada",
  "salida",
  "ajuste",
  "transferencia",
  "devolucion",
] as const;
export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPES)[number];

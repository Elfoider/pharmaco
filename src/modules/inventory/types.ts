export type Batch = {
  id: string;
  productId: string;
  lotNumber: string;
  expiryDate: string;
  stock: number;
  branchId: string;
  createdAt: string;
  updatedAt: string;
};

export type InventoryMovementType = "entrada" | "salida" | "ajuste";

export type InventoryMovement = {
  id: string;
  type: InventoryMovementType;
  productId: string;
  batchId: string;
  quantity: number;
  reason: string;
  createdAt: string;
};

export type EntryInput = {
  productId: string;
  lotNumber: string;
  expiryDate: string;
  quantity: number;
  branchId: string;
  reason: string;
};

export type AdjustmentInput = {
  productId: string;
  batchId: string;
  quantity: number;
  reason: string;
};

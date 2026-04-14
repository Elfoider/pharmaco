export type EntityStatus = "active" | "inactive" | "archived";

export type BaseEntity = {
  id: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
};

export type UserRole =
  | "super_admin"
  | "admin"
  | "farmaceutico"
  | "cajero"
  | "almacenista"
  | "rrhh";

export type AppUser = BaseEntity & {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  employeeId?: string;
  lastLoginAt?: string;
};

export type Employee = BaseEntity & {
  name: string;
  document: string;
  phone: string;
  email?: string;
  role: UserRole;
  cargo: string;
  joinDate: string;
  branchId: string;
};

export type Client = BaseEntity & {
  name: string;
  document: string;
  phone: string;
  email?: string;
  address?: string;
  birthDate?: string;
  notes?: string;
};

export type Batch = BaseEntity & {
  productId: string;
  lotNumber: string;
  expiresAt: string;
  quantity: number;
  unitCost: number;
  supplierName?: string;
};

export type Product = BaseEntity & {
  name: string;
  genericName: string;
  barcode: string;
  sku: string;
  category: string;
  laboratory: string;
  requiresPrescription: boolean;
  controlled: boolean;
  costPrice: number;
  salePrice: number;
  stock: number;
  active: boolean;
};

export type InventoryMovement = BaseEntity & {
  productId: string;
  batchId?: string;
  movementType: "entrada" | "salida" | "ajuste" | "transferencia" | "devolucion";
  quantity: number;
  reason: string;
  referenceId?: string;
  performedByUserId: string;
};

export type Sale = BaseEntity & {
  saleNumber: string;
  clientId?: string;
  cashierUserId: string;
  saleItemIds?: string[];
  itemTypesCount?: number;
  itemsQuantityTotal?: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | "mixed";
  returnStatus?: "none" | "partial" | "full";
  returnedItemsQuantity?: number;
  returnedAmountTotal?: number;
  lastReturnAt?: string;
  notes?: string;
};

export type SaleItem = BaseEntity & {
  saleId: string;
  saleNumber?: string;
  productId: string;
  batchId?: string;
  quantity: number;
  originalQuantity?: number;
  returnedQuantity?: number;
  returnStatus?: "none" | "partial" | "full";
  unitPrice: number;
  discount: number;
  lineTotal: number;
};

export type SaleReturn = BaseEntity & {
  saleId: string;
  saleNumber: string;
  saleItemIds: string[];
  returnNumber: string;
  reason: string;
  refundMethod: "cash" | "card" | "transfer" | "store_credit" | "mixed";
  refundAmount: number;
  status: "requested" | "approved" | "processed" | "cancelled";
  inventoryRestocked: boolean;
  processedByUserId: string;
  processedAt?: string;
  notes?: string;
};

export type SaleReturnItem = BaseEntity & {
  saleReturnId: string;
  saleId: string;
  saleItemId: string;
  productId: string;
  sourceBatchId?: string;
  restockBatchId?: string;
  quantity: number;
  unitPrice: number;
  lineRefund: number;
  restockStatus: "pending" | "restocked" | "skipped";
  inventoryMovementId?: string;
};

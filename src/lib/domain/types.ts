import type { UserRole } from "@/lib/auth/roles";
import type {
  ClientType,
  DocStatus,
  EmployeeType,
  InventoryMovementType,
  ProductCategory,
} from "@/lib/domain/enums";

export type EntityBase = {
  id: string;
  status: DocStatus;
  createdAt: string;
  updatedAt: string;
};

export type AppUser = EntityBase & {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  employeeId?: string;
  lastLoginAt?: string;
};

export type Employee = EntityBase & {
  code: string;
  fullName: string;
  documentId: string;
  employeeType: EmployeeType;
  area: string;
  position: string;
  phone?: string;
  email?: string;
  userId?: string;
};

export type Client = EntityBase & {
  code: string;
  clientType: ClientType;
  fullName: string;
  documentId?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type Batch = {
  batchId: string;
  lotNumber: string;
  expiresAt: string;
  quantity: number;
  unitCost: number;
  supplierName?: string;
};

export type Product = EntityBase & {
  sku: string;
  barcode?: string;
  name: string;
  category: ProductCategory;
  unit: string;
  salePrice: number;
  purchasePrice: number;
  requiresPrescription: boolean;
  stockMin: number;
  stockMax: number;
  batches: Batch[];
};

export type InventoryMovement = EntityBase & {
  productId: string;
  batchId?: string;
  movementType: InventoryMovementType;
  quantity: number;
  reason: string;
  referenceId?: string;
  performedByUserId: string;
};

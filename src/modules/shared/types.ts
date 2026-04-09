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
  sku: string;
  barcode?: string;
  name: string;
  category: "medicamento" | "insumo" | "dispositivo" | "cuidado_personal" | "otro";
  unit: string;
  salePrice: number;
  purchasePrice: number;
  requiresPrescription: boolean;
  stockMin: number;
  stockMax: number;
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
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | "mixed";
  notes?: string;
};

export type SaleItem = BaseEntity & {
  saleId: string;
  productId: string;
  batchId?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
};

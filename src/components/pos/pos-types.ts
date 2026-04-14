export type PosProduct = {
  id: string;
  name: string;
  genericName: string;
  sku: string;
  barcode: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  controlled: boolean;
};

export type PosCustomer = {
  id: string;
  name: string;
  document: string;
  phone: string;
};

export type PosCartItem = {
  product: PosProduct;
  quantity: number;
  note?: string;
  batchMode: "auto" | "manual";
  selectedBatchId?: string;
};

export type PosBatch = {
  id: string;
  productId: string;
  lotNumber: string;
  expiryDate: string;
  stock: number;
};

export type PosState = {
  search: string;
  customerSearch: string;
  selectedCustomerId: string | "none";
  cart: PosCartItem[];
  lastChangedProductId: string | null;
  manualDiscount: number;
  taxPercent: number;
  paymentMethod: "cash" | "card" | "transfer" | "mixed";
};

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
};

export type PosCartItem = {
  product: PosProduct;
  quantity: number;
  note?: string;
};

export type PosState = {
  search: string;
  selectedCustomerId: string | "none";
  cart: PosCartItem[];
  lastChangedProductId: string | null;
};

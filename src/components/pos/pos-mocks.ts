import type { PosCustomer, PosProduct } from "@/components/pos/pos-types";

export const POS_MOCK_PRODUCTS: PosProduct[] = [
  {
    id: "prd-1",
    name: "Paracetamol 500mg",
    genericName: "Acetaminofén",
    sku: "PRD-1001",
    barcode: "7701234567891",
    price: 2.5,
    stock: 120,
  },
  {
    id: "prd-2",
    name: "Ibuprofeno 400mg",
    genericName: "Ibuprofeno",
    sku: "PRD-1002",
    barcode: "7701234567892",
    price: 3.2,
    stock: 80,
  },
  {
    id: "prd-3",
    name: "Amoxicilina 500mg",
    genericName: "Amoxicilina",
    sku: "PRD-2030",
    barcode: "7701234567901",
    price: 4.75,
    stock: 35,
  },
];

export const POS_MOCK_CUSTOMERS: PosCustomer[] = [
  {
    id: "cl-1",
    name: "María Pérez",
    document: "V-12345678",
  },
  {
    id: "cl-2",
    name: "Carlos Gómez",
    document: "V-87654321",
  },
];

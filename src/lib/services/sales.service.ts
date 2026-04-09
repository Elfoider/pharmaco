import type { Sale, SaleItem } from "@/modules/sales/types";
import { COLLECTIONS, createCrudService } from "@/lib/services/_firestore";

export const salesService = createCrudService<Sale>(COLLECTIONS.sales);
export const saleItemsService = createCrudService<SaleItem>(COLLECTIONS.saleItems);

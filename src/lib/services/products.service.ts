import type { Batch, Product } from "@/modules/products/types";
import { COLLECTIONS, createCrudService } from "@/lib/services/_firestore";

export const productsService = createCrudService<Product>(COLLECTIONS.products);
export const batchesService = createCrudService<Batch>(COLLECTIONS.batches);

import type { InventoryMovement } from "@/modules/inventory/types";
import { COLLECTIONS, createCrudService } from "@/lib/services/_firestore";

export const inventoryService = createCrudService<InventoryMovement>(COLLECTIONS.inventoryMovements);

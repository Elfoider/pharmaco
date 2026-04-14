import { COLLECTIONS } from "@/lib/firestore/collections";
import { createDocument, getDocument, listDocuments } from "@/lib/firestore/base-service";
import type { InventoryMovement } from "@/lib/domain/types";

export const inventoryService = {
  listMovements: (take?: number) => listDocuments<InventoryMovement>(COLLECTIONS.inventoryMovements, take),
  getMovementById: (id: string) => getDocument<InventoryMovement>(COLLECTIONS.inventoryMovements, id),
  createMovement: (payload: Omit<InventoryMovement, "id">) =>
    createDocument(COLLECTIONS.inventoryMovements, payload),
};

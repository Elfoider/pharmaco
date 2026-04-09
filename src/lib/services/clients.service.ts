import type { Client } from "@/modules/clients/types";
import { COLLECTIONS, createCrudService } from "@/lib/services/_firestore";

export const clientsService = createCrudService<Client>(COLLECTIONS.clients);

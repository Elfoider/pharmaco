import { COLLECTIONS } from "@/lib/firestore/collections";
import { createDocument, getDocument, listDocuments } from "@/lib/firestore/base-service";
import type { AppUser } from "@/lib/domain/types";

export const usersService = {
  list: (take?: number) => listDocuments<AppUser>(COLLECTIONS.users, take),
  getById: (id: string) => getDocument<AppUser>(COLLECTIONS.users, id),
  create: (payload: Omit<AppUser, "id">) => createDocument(COLLECTIONS.users, payload),
};

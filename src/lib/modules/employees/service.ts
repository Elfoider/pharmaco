import { COLLECTIONS } from "@/lib/firestore/collections";
import { createDocument, getDocument, listDocuments } from "@/lib/firestore/base-service";
import type { Employee } from "@/lib/domain/types";

export const employeesService = {
  list: (take?: number) => listDocuments<Employee>(COLLECTIONS.employees, take),
  getById: (id: string) => getDocument<Employee>(COLLECTIONS.employees, id),
  create: (payload: Omit<Employee, "id">) => createDocument(COLLECTIONS.employees, payload),
};

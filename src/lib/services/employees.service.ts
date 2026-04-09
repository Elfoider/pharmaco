import type { Employee } from "@/modules/employees/types";
import { COLLECTIONS, createCrudService } from "@/lib/services/_firestore";

export const employeesService = createCrudService<Employee>(COLLECTIONS.employees);

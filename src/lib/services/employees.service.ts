import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Employee } from "@/modules/employees/types";
import type { EmployeeFormValues } from "@/lib/validations/employee";

function getEmployeesCollection() {
  if (!db) {
    throw new Error("Firestore no configurado");
  }

  return collection(db, "employees");
}

function normalize(value?: string) {
  return (value ?? "").toLowerCase().trim();
}

function mapEmployee(id: string, data: Record<string, unknown>): Employee {
  return {
    id,
    status: data.status === "inactive" ? "inactive" : "active",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    name: typeof data.name === "string" ? data.name : "",
    document: typeof data.document === "string" ? data.document : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    email: typeof data.email === "string" ? data.email : "",
    role:
      data.role === "super_admin" ||
      data.role === "admin" ||
      data.role === "farmaceutico" ||
      data.role === "cajero" ||
      data.role === "almacenista" ||
      data.role === "rrhh"
        ? data.role
        : "cajero",
    cargo: typeof data.cargo === "string" ? data.cargo : "",
    joinDate: typeof data.joinDate === "string" ? data.joinDate : "",
    branchId: typeof data.branchId === "string" ? data.branchId : "",
  };
}

export const employeesService = {
  async create(payload: EmployeeFormValues) {
    const now = new Date().toISOString();
    const result = await addDoc(getEmployeesCollection(), {
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    });

    return result.id;
  },

  async getById(id: string): Promise<Employee | null> {
    const snap = await getDoc(doc(getEmployeesCollection(), id));
    if (!snap.exists()) return null;
    return mapEmployee(snap.id, snap.data());
  },

  async getAll(take = 120): Promise<Employee[]> {
    const snap = await getDocs(query(getEmployeesCollection(), orderBy("name", "asc"), limit(take)));
    return snap.docs.map((item) => mapEmployee(item.id, item.data()));
  },

  async search(term: string, roleFilter: Employee["role"] | "all" = "all", take = 120): Promise<Employee[]> {
    const all = await this.getAll(take);
    const q = normalize(term);

    return all.filter((employee) => {
      const byRole = roleFilter === "all" ? true : employee.role === roleFilter;

      if (!q) {
        return byRole;
      }

      const byName = normalize(employee.name).includes(q);
      const byDocument = normalize(employee.document).includes(q);
      const byPhone = normalize(employee.phone).includes(q);

      return byRole && (byName || byDocument || byPhone);
    });
  },

  async update(id: string, payload: Partial<EmployeeFormValues>) {
    await updateDoc(doc(getEmployeesCollection(), id), {
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp(),
    });
  },

  async delete(id: string) {
    await deleteDoc(doc(getEmployeesCollection(), id));
  },
};

import { z } from "zod";

export const USER_ROLES = [
  "super_admin",
  "admin",
  "farmaceutico",
  "cajero",
  "almacenista",
  "rrhh",
] as const;

export const roleSchema = z.enum(USER_ROLES);

export type UserRole = z.infer<typeof roleSchema>;

export const DASHBOARD_ACCESS_ROLES: readonly UserRole[] = USER_ROLES;

export type PharmacoUser = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
};

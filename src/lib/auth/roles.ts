import { z } from "zod";

export const USER_ROLES = [
  "super_admin",
  "admin",
  "farmaceutico",
  "cajero",
  "almacenista",
  "rrhh",
] as const;

export const userRoleSchema = z.enum(USER_ROLES);

export type UserRole = z.infer<typeof userRoleSchema>;

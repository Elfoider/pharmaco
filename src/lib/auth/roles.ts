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

export type NavItem = {
  label: string;
  href: string;
  allowedRoles: readonly UserRole[];
};

export const ALL_ROLES: readonly UserRole[] = USER_ROLES;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: "/dashboard", allowedRoles: ALL_ROLES },
  { label: "POS", href: "/dashboard/pos", allowedRoles: ["super_admin", "admin", "cajero"] },
  { label: "Clientes", href: "/dashboard/clientes", allowedRoles: ["super_admin", "admin", "cajero", "farmaceutico"] },
  { label: "Empleados", href: "/dashboard/empleados", allowedRoles: ["super_admin", "admin", "rrhh"] },
  { label: "Inventario", href: "/dashboard/inventario", allowedRoles: ["super_admin", "admin", "almacenista", "farmaceutico"] },
  { label: "Horarios", href: "/dashboard/rrhh", allowedRoles: ["super_admin", "admin", "rrhh"] },
  { label: "Tareas", href: "/dashboard", allowedRoles: ALL_ROLES },
  { label: "IA Asistente", href: "/dashboard", allowedRoles: ["super_admin", "admin", "farmaceutico", "rrhh"] },
];

export const PROTECTED_ROUTE_RULES: Readonly<Record<string, readonly UserRole[]>> = {
  "/dashboard": ALL_ROLES,
  "/dashboard/pos": ["super_admin", "admin", "cajero"],
  "/dashboard/clientes": ["super_admin", "admin", "cajero", "farmaceutico"],
  "/dashboard/empleados": ["super_admin", "admin", "rrhh"],
  "/dashboard/inventario": ["super_admin", "admin", "almacenista", "farmaceutico"],
  "/dashboard/rrhh": ["super_admin", "admin", "rrhh"],
};

export function canAccessPath(role: UserRole, pathname: string) {
  const matchedEntry = Object.entries(PROTECTED_ROUTE_RULES)
    .sort(([a], [b]) => b.length - a.length)
    .find(([prefix]) => pathname.startsWith(prefix));

  if (!matchedEntry) {
    return true;
  }

  const [, allowedRoles] = matchedEntry;
  return allowedRoles.includes(role);
}

export function getRoleNavigation(role: UserRole) {
  return NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));
}

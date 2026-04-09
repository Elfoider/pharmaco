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
  { label: "Inventario", href: "/dashboard", allowedRoles: ["super_admin", "admin", "almacenista"] },
  { label: "Caja", href: "/dashboard", allowedRoles: ["super_admin", "admin", "cajero"] },
  { label: "Farmacia", href: "/dashboard", allowedRoles: ["super_admin", "admin", "farmaceutico"] },
  { label: "RRHH", href: "/dashboard/rrhh", allowedRoles: ["super_admin", "admin", "rrhh"] },
];

export const PROTECTED_ROUTE_RULES: Readonly<Record<string, readonly UserRole[]>> = {
  "/dashboard": ALL_ROLES,
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

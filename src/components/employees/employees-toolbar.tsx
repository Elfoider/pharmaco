"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { USER_ROLES, type UserRole } from "@/lib/auth/roles";

type EmployeesToolbarProps = {
  search: string;
  roleFilter: UserRole | "all";
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: UserRole | "all") => void;
  onCreateClick: () => void;
};

export function EmployeesToolbar({
  search,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onCreateClick,
}: EmployeesToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre, documento o teléfono"
            className="h-11 w-full rounded-xl border border-white/15 bg-slate-950/65 pl-9 pr-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20"
          />
        </div>

        <Button type="button" className="h-11 px-4" onClick={onCreateClick}>
          <Plus className="h-4 w-4" /> Nuevo empleado
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Filtrar rol:</span>
        <select
          value={roleFilter}
          onChange={(event) => onRoleFilterChange(event.target.value as UserRole | "all")}
          className="h-9 rounded-lg border border-white/15 bg-slate-950/65 px-3 text-xs text-slate-100 outline-none transition focus:border-cyan-300/80"
        >
          <option value="all">Todos</option>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

"use client";

import { Pencil } from "lucide-react";

import type { Employee } from "@/modules/employees/types";
import { RoleBadge } from "@/components/employees/role-badge";

type EmployeesTableProps = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
};

export function EmployeesTable({ employees, onEdit }: EmployeesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Documento</th>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium">Cargo</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
              <td className="px-4 py-3">{employee.name}</td>
              <td className="px-4 py-3">{employee.document}</td>
              <td className="px-4 py-3">{employee.phone}</td>
              <td className="px-4 py-3">
                <RoleBadge role={employee.role} />
              </td>
              <td className="px-4 py-3">{employee.cargo}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] ${
                    employee.status === "active"
                      ? "border-emerald-300/35 bg-emerald-400/15 text-emerald-100"
                      : "border-slate-300/25 bg-slate-400/10 text-slate-300"
                  }`}
                >
                  {employee.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onEdit(employee)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-100 transition hover:border-cyan-300/40 hover:text-cyan-100"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

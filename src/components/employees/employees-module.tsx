"use client";

import { Building2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmployeeForm } from "@/components/employees/employee-form";
import { EmployeesTable } from "@/components/employees/employees-table";
import { EmployeesToolbar } from "@/components/employees/employees-toolbar";
import { EmptyState } from "@/components/data/empty-state";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { Employee } from "@/modules/employees/types";
import { employeesService } from "@/lib/services/employees.service";
import type { EmployeeFormValues } from "@/lib/validations/employee";
import type { UserRole } from "@/lib/auth/roles";

const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Ana Ruiz",
    document: "V-10223344",
    phone: "+58 412 111 1111",
    email: "ana@pharmaco.com",
    role: "farmaceutico",
    cargo: "Regente",
    joinDate: "2023-03-12",
    branchId: "BR-01",
  },
];

export function EmployeesModule() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function loadEmployees(term = "", role: UserRole | "all" = "all") {
    setIsLoading(true);
    try {
      const data = await employeesService.search(term, role);
      setEmployees(data.length ? data : mockEmployees);
    } catch {
      setEmployees(mockEmployees);
      setFeedback({ kind: "error", message: "No fue posible sincronizar empleados desde Firestore." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadEmployees();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadEmployees(search, roleFilter);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const activeCount = useMemo(() => employees.filter((employee) => employee.status === "active").length, [employees]);

  async function handleCreateOrUpdate(values: EmployeeFormValues) {
    try {
      if (formMode === "create") {
        await employeesService.create(values);
        setFeedback({ kind: "success", message: "Empleado creado correctamente." });
      } else if (editingEmployee) {
        await employeesService.update(editingEmployee.id, values);
        setFeedback({ kind: "success", message: "Empleado actualizado correctamente." });
      }

      setFormMode("create");
      setEditingEmployee(null);
      await loadEmployees(search, roleFilter);
    } catch {
      setFeedback({ kind: "error", message: "No fue posible guardar el empleado." });
    }
  }

  function handleStartCreate() {
    setFormMode("create");
    setEditingEmployee(null);
  }

  function handleStartEdit(employee: Employee) {
    setFormMode("edit");
    setEditingEmployee(employee);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="Employees"
          subtitle="Gestión base de empleados con asignación de rol y filtros para operación corporativa." 
          badge="Módulo operativo"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ModuleStat label="Empleados" value={String(employees.length)} />
          <ModuleStat label="Activos" value={String(activeCount)} />
          <ModuleStat label="Inactivos" value={String(employees.length - activeCount)} />
        </div>

        <EmployeesToolbar
          search={search}
          roleFilter={roleFilter}
          onSearchChange={setSearch}
          onRoleFilterChange={setRoleFilter}
          onCreateClick={handleStartCreate}
        />

        {feedback ? (
          <GlassPanel
            className={`border ${feedback.kind === "success" ? "border-emerald-300/30 bg-emerald-400/10" : "border-rose-300/30 bg-rose-400/10"}`}
          >
            <p className={`text-sm ${feedback.kind === "success" ? "text-emerald-100" : "text-rose-100"}`}>
              {feedback.message}
            </p>
          </GlassPanel>
        ) : null}

        <GlassPanel className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-300" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Formulario empleado</h2>
          </div>
          <EmployeeForm
            mode={formMode}
            initialEmployee={editingEmployee}
            onCancel={handleStartCreate}
            onSubmitEmployee={handleCreateOrUpdate}
          />
        </GlassPanel>

        {isLoading ? (
          <EmptyState title="Cargando empleados" description="Estamos preparando el listado de empleados..." />
        ) : employees.length ? (
          <EmployeesTable employees={employees} onEdit={handleStartEdit} />
        ) : (
          <EmptyState
            title="Sin empleados aún"
            description="Presiona 'Nuevo empleado' para comenzar a registrar personal." 
          />
        )}
      </div>
    </main>
  );
}

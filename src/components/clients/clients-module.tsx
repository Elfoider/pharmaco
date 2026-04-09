"use client";

import { UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ClientForm } from "@/components/clients/client-form";
import { ClientsTable } from "@/components/clients/clients-table";
import { ClientsToolbar } from "@/components/clients/clients-toolbar";
import { EmptyState } from "@/components/data/empty-state";
import { ModuleHeader } from "@/components/data/module-header";
import { ModuleStat } from "@/components/data/module-stat";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { Client } from "@/lib/domain/types";
import { clientsService } from "@/lib/modules/clients/service";
import type { ClientFormValues } from "@/lib/validations/client";

const mockClients: Client[] = [
  {
    id: "mock-1",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    code: "CLI-001",
    clientType: "persona",
    fullName: "María Torres",
    documentId: "V-12345678",
    phone: "+58 412 000 0001",
    email: "maria.torres@correo.com",
    address: "Zona Centro",
  },
  {
    id: "mock-2",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    code: "CLI-002",
    clientType: "empresa",
    fullName: "Farmacia Central Norte",
    documentId: "J-403001221",
    phone: "+58 212 000 0002",
    email: "compras@fcn.com",
    address: "Avenida Principal",
  },
];

export function ClientsModule() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  async function loadClients(term = "") {
    setIsLoading(true);

    try {
      const data = term ? await clientsService.search(term) : await clientsService.list();
      setClients(data.length ? data : mockClients);
    } catch {
      setClients(mockClients);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadClients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadClients(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const personCount = useMemo(
    () => clients.filter((client) => client.clientType === "persona").length,
    [clients],
  );

  async function handleCreateOrUpdate(values: ClientFormValues) {
    if (formMode === "create") {
      await clientsService.create(values);
    } else if (editingClient) {
      await clientsService.update(editingClient.id, values);
    }

    setFormMode("create");
    setEditingClient(null);
    await loadClients(search);
  }

  function handleStartCreate() {
    setFormMode("create");
    setEditingClient(null);
  }

  function handleStartEdit(client: Client) {
    setFormMode("edit");
    setEditingClient(client);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <ModuleHeader
          title="Clientes"
          subtitle="Listado, búsqueda, creación y edición básica de clientes para preparar el POS."
          badge="Módulo operativo"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ModuleStat label="Clientes" value={String(clients.length)} />
          <ModuleStat label="Personas" value={String(personCount)} />
          <ModuleStat label="Empresas" value={String(clients.length - personCount)} />
        </div>

        <ClientsToolbar search={search} onSearchChange={setSearch} onCreateClick={handleStartCreate} />

        <GlassPanel className="space-y-3">
          <div className="flex items-center gap-2">
            <UsersRound className="h-4 w-4 text-cyan-300" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Formulario cliente</h2>
          </div>
          <ClientForm
            mode={formMode}
            initialClient={editingClient}
            onCancel={handleStartCreate}
            onSubmitClient={handleCreateOrUpdate}
          />
        </GlassPanel>

        {isLoading ? (
          <EmptyState title="Cargando clientes" description="Estamos preparando el listado de clientes..." />
        ) : clients.length ? (
          <ClientsTable clients={clients} onEdit={handleStartEdit} />
        ) : (
          <EmptyState
            title="Sin clientes aún"
            description="Crea tu primer cliente para habilitar operaciones comerciales en POS." 
          />
        )}
      </div>
    </main>
  );
}

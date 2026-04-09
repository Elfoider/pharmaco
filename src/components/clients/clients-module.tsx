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
import type { Client } from "@/modules/clients/types";
import { clientsService } from "@/lib/services/clients.service";
import type { ClientFormValues } from "@/lib/validations/client";

const mockClients: Client[] = [
  {
    id: "mock-1",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "María Torres",
    document: "V-12345678",
    phone: "+58 412 000 0001",
    email: "maria.torres@correo.com",
    address: "Zona Centro",
    birthDate: "1992-05-11",
    notes: "Cliente frecuente",
  },
];

export function ClientsModule() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function loadClients(term = "") {
    setIsLoading(true);

    try {
      const data = term ? await clientsService.search(term) : await clientsService.getAll();
      setClients(data.length ? data : mockClients);
    } catch {
      setClients(mockClients);
      setFeedback({ kind: "error", message: "No fue posible sincronizar clientes desde Firestore." });
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

  const withEmailCount = useMemo(() => clients.filter((client) => Boolean(client.email)).length, [clients]);

  async function handleCreateOrUpdate(values: ClientFormValues) {
    try {
      if (formMode === "create") {
        await clientsService.create(values);
        setFeedback({ kind: "success", message: "Cliente creado correctamente." });
      } else if (editingClient) {
        await clientsService.update(editingClient.id, values);
        setFeedback({ kind: "success", message: "Cliente actualizado correctamente." });
      }

      setFormMode("create");
      setEditingClient(null);
      await loadClients(search);
    } catch {
      setFeedback({ kind: "error", message: "No fue posible guardar el cliente." });
    }
  }

  async function handleDelete(client: Client) {
    try {
      await clientsService.delete(client.id);
      setFeedback({ kind: "success", message: `Cliente ${client.name} eliminado.` });
      await loadClients(search);
    } catch {
      setFeedback({ kind: "error", message: "No fue posible eliminar el cliente." });
    }
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
          title="Clients"
          subtitle="Listado, búsqueda en tiempo real, creación y edición básica para operaciones comerciales." 
          badge="Módulo operativo"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ModuleStat label="Clientes" value={String(clients.length)} />
          <ModuleStat label="Con email" value={String(withEmailCount)} />
          <ModuleStat label="Sin email" value={String(clients.length - withEmailCount)} />
        </div>

        <ClientsToolbar search={search} onSearchChange={setSearch} onCreateClick={handleStartCreate} />

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
          <ClientsTable clients={clients} onEdit={handleStartEdit} onDelete={handleDelete} />
        ) : (
          <EmptyState
            title="Sin clientes aún"
            description="Presiona 'Nuevo cliente' para comenzar a construir tu base comercial." 
          />
        )}
      </div>
    </main>
  );
}

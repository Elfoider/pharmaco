"use client";

import { Pencil } from "lucide-react";

import type { Client } from "@/lib/domain/types";

type ClientsTableProps = {
  clients: Client[];
  onEdit: (client: Client) => void;
};

export function ClientsTable({ clients, onEdit }: ClientsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-4 py-3 font-medium">Código</th>
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Documento</th>
            <th className="px-4 py-3 font-medium">Teléfono</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
              <td className="px-4 py-3">{client.code}</td>
              <td className="px-4 py-3">{client.fullName}</td>
              <td className="px-4 py-3">{client.documentId || "—"}</td>
              <td className="px-4 py-3">{client.phone || "—"}</td>
              <td className="px-4 py-3 capitalize">{client.clientType}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onEdit(client)}
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

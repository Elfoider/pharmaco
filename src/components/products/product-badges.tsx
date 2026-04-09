export function PrescriptionBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        enabled
          ? "border-amber-300/35 bg-amber-400/15 text-amber-100"
          : "border-slate-300/20 bg-slate-300/8 text-slate-300"
      }`}
    >
      {enabled ? "Requiere récipe" : "Sin récipe"}
    </span>
  );
}

export function ControlledBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        enabled
          ? "border-rose-300/35 bg-rose-400/15 text-rose-100"
          : "border-slate-300/20 bg-slate-300/8 text-slate-300"
      }`}
    >
      {enabled ? "Controlado" : "No controlado"}
    </span>
  );
}

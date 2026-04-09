import { cn } from "@/lib/utils/cn";

type DataTableProps = {
  columns: string[];
  rows: Array<Array<string>>;
  className?: string;
};

export function DataTable({ columns, rows, className }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35", className)}>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.16em] text-slate-400">
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="border-b border-white/6 text-slate-200/95 last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

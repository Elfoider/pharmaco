import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/15 bg-slate-900/70 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.45)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

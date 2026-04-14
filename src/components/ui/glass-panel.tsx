import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_14px_42px_rgba(2,6,23,0.42)] backdrop-blur-lg",
        className,
      )}
      {...props}
    />
  );
}

import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type StatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "success" | "info" | "neutral";
};

const tones: Record<NonNullable<StatusChipProps["tone"]>, string> = {
  success: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  info: "border-cyan-300/30 bg-cyan-400/10 text-cyan-100",
  neutral: "border-slate-300/20 bg-slate-300/10 text-slate-200",
};

export function StatusChip({ className, tone = "neutral", ...props }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

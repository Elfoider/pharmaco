import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <input
        className={cn(
          "h-11 w-full rounded-xl border border-white/15 bg-slate-950/65 px-3 text-sm text-slate-50 shadow-inner shadow-black/20 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/20",
          error && "border-rose-400/70 focus:border-rose-300 focus:ring-rose-400/20",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

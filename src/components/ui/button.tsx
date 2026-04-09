import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export function Button({ className, children, isLoading, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.25)] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {isLoading ? "Validando..." : children}
    </button>
  );
}

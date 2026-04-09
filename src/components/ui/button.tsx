import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export function Button({ className, children, isLoading, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-5 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75",
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {isLoading ? "Validando acceso..." : children}
    </button>
  );
}

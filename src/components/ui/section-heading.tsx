import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  className,
  eyebrow,
  title,
  description,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-300/90">{eyebrow}</p>
      <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-slate-300/90">{description}</p> : null}
    </div>
  );
}

"use client";

import { PosProvider } from "@/components/pos/pos-provider";
import { PosShell } from "@/components/pos/pos-shell";

export function PosModule() {
  return (
    <PosProvider>
      <PosShell />
    </PosProvider>
  );
}

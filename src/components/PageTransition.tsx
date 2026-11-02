"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Entrada suave de cada pantalla (se desactiva si el sistema pide menos movimiento). */
export function PageTransition({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div key={path} className="anim-fade-up">
      {children}
    </div>
  );
}

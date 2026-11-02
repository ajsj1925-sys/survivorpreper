"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "./ui";

/** Anillo de progreso SVG. */
export function Ring({
  pct,
  size = 140,
  stroke = 12,
  color = "#ea580c",
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f5f5f4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (p / 100) * c}
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

/** Barra con icono: “💧 ████░░ 2,1 / 3 días”. */
export function Meter({ emoji, label, value, max, display }: { emoji: string; label: string; value: number; max: number; display: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = pct >= 100 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl" aria-hidden>{emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between text-xs font-medium text-stone-500">
          <span>{label}</span>
          <span className="tabular-nums text-stone-800">{display}</span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-stone-100">
          <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Panel inferior (móvil) / modal (escritorio). */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>
  );
}

export function Stepper({ value, onChange, min = 0, label }: { value: number; onChange: (n: number) => void; min?: number; label?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-stone-100 p-1" aria-label={label}>
      <button type="button" aria-label={`Menos ${label ?? ""}`} onClick={() => onChange(Math.max(min, value - 1))}
        className="h-9 w-9 rounded-full bg-white text-lg font-bold shadow-sm disabled:opacity-40" disabled={value <= min}>−</button>
      <span className="w-8 text-center text-lg font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label={`Más ${label ?? ""}`} onClick={() => onChange(value + 1)}
        className="h-9 w-9 rounded-full bg-white text-lg font-bold shadow-sm">+</button>
    </div>
  );
}

export function Emoji({ e, className }: { e: string; className?: string }) {
  return <span aria-hidden className={cn("leading-none", className)}>{e}</span>;
}

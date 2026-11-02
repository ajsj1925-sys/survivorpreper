"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CAT_META, searchCatalog, type CatalogItem } from "@/lib/catalog";
import { fmtNumber } from "@/lib/calc";
import type { KitCategory } from "@/lib/types";
import { cn } from "./ui";

function subtitle(c: CatalogItem) {
  if (c.waterL) return `${fmtNumber(c.waterL, 1)} L`;
  if (c.kcal) return `${fmtNumber(c.kcal)} kcal`;
  return c.weightG >= 1000 ? `${fmtNumber(c.weightG / 1000, 1)} kg` : `${c.weightG} g`;
}

// Lo primero que se ve en "Todo": lo más habitual en un kit y en una despensa
const POPULAR = ["agua-15", "agua-5", "racion", "atun", "arroz", "leche", "pasta", "garbanzos", "barrita", "frutos-secos",
  "frontal", "radio", "pilas", "powerbank", "botiquin", "paracetamol", "manta", "galletas", "aceite", "papel", "jabon", "ibuprofeno"];

/** Cuadrícula de productos: tocar = +1. Sin formularios. */
export function ProductPicker({
  pool,
  counts = {},
  onAdd,
  onDec,
  compact = false,
}: {
  pool: CatalogItem[];
  counts?: Record<string, number>;
  onAdd: (c: CatalogItem) => void;
  onDec?: (c: CatalogItem) => void;
  compact?: boolean;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<KitCategory | "todo">("todo");
  const [all, setAll] = useState(false);
  const LIMIT = 12; // en "Todo" se ven los más usados; el resto con "Ver todos" o por categoría
  const cats = useMemo(() => [...new Set(pool.map((c) => c.cat))], [pool]);
  const items = useMemo(() => {
    const rank = (id: string) => (POPULAR.indexOf(id) + 1 || 999);
    const base = cat === "todo" ? [...pool].sort((a, b) => rank(a.id) - rank(b.id)) : pool.filter((c) => c.cat === cat);
    return searchCatalog(q, q ? pool : base);
  }, [pool, q, cat]);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar: atún, agua, linterna…"
          aria-label="Buscar producto"
          className="w-full rounded-full py-2.5 pl-9"
        />
      </div>

      {!q && (
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {(["todo", ...cats] as const).map((k) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                cat === k ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200",
              )}
            >
              <span aria-hidden>{k === "todo" ? "✨" : CAT_META[k].emoji}</span>
              {k === "todo" ? "Todo" : CAT_META[k].label}
            </button>
          ))}
        </div>
      )}

      <div className={cn("mt-3 grid gap-2", compact ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5")}>
        {(q || cat !== "todo" || all ? items : items.slice(0, LIMIT)).map((c) => {
          const n = counts[c.id] ?? 0;
          return (
            <div key={c.id} className="relative">
              <button
                onClick={() => onAdd(c)}
                aria-label={`Añadir ${c.name}`}
                className={cn(
                  "flex h-full w-full flex-col items-center gap-1 rounded-2xl border p-2.5 text-center transition active:scale-95",
                  n > 0 ? "border-brand-500 bg-brand-50" : "border-stone-200 bg-white hover:border-stone-300",
                )}
              >
                <span aria-hidden className="text-3xl leading-none">{c.emoji}</span>
                <span className="line-clamp-2 text-xs font-medium leading-tight">{c.name}</span>
                <span className="text-[10px] text-stone-500">{subtitle(c)}</span>
              </button>
              {n > 0 && (
                <>
                  <span className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white shadow">
                    {n}
                  </span>
                  {onDec && (
                    <button
                      onClick={() => onDec(c)}
                      aria-label={`Quitar ${c.name}`}
                      className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-stone-600 shadow ring-1 ring-stone-200"
                    >
                      −
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {!q && cat === "todo" && !all && items.length > LIMIT && (
        <button onClick={() => setAll(true)} className="mt-3 w-full rounded-2xl bg-stone-100 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-200">
          Ver los {items.length} productos
        </button>
      )}
      {items.length === 0 && <p className="mt-4 text-center text-sm text-stone-500">No está en la lista. Añádelo a mano abajo.</p>}
    </div>
  );
}

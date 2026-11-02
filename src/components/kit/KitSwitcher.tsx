"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { FREE_KITS, useStore } from "@/lib/store";
import { Icon } from "@/components/icons/Icon";
import { Button, cn } from "@/components/ui";
import { Sheet } from "@/components/visual";

const PRESETS: [string, string][] = [
  ["Coche", "car-simple"],
  ["Trabajo", "briefcase"],
  ["Evacuación", "backpack"],
  ["Segunda casa", "house-line"],
];

/** Selector de mochilas: Casa, Coche, Trabajo… (2 gratis, más en Pro). */
export function KitSwitcher({ onLimit }: { onLimit: () => void }) {
  const { kits, activeKitId, setActiveKit, addKit, kit } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function create(n: string, ic: string) {
    if (!n.trim()) return;
    addKit(n.trim(), ic);
    setOpen(false);
    setName("");
  }

  return (
    <>
      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Mochilas">
        {kits.map((k) => {
          const n = kit.filter((i) => (i.kitId ?? "main") === k.id).reduce((a, i) => a + i.qty, 0);
          const active = k.id === activeKitId;
          return (
            <button key={k.id} role="tab" aria-selected={active} onClick={() => setActiveKit(k.id)}
              className={cn("flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-semibold transition",
                active ? "bg-stone-900 text-white shadow-sm" : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50")}>
              <Icon name={k.icon} className="h-5 w-5" />
              {k.name}
              <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-white/20" : "bg-stone-100 text-stone-500")}>{n}</span>
            </button>
          );
        })}
        <button onClick={() => (kits.length >= FREE_KITS ? onLimit() : setOpen(true))} aria-label="Nueva mochila"
          className="flex shrink-0 items-center gap-1.5 rounded-2xl border-2 border-dashed border-stone-300 px-3.5 py-2 text-sm font-medium text-stone-500 hover:border-brand-500 hover:text-brand-600">
          <Plus className="h-4 w-4" /> Mochila
        </button>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Nueva mochila">
        <p className="mb-3 text-sm text-stone-500">Para tener otro kit en el coche, en el trabajo o listo para salir de casa.</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map(([n, ic]) => (
            <button key={n} onClick={() => create(n, ic)}
              className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3 text-left font-medium ring-1 ring-stone-200 hover:ring-brand-500">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-stone-200"><Icon name={ic} className="h-6 w-6" /></span>
              {n}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2 pb-2">
          <input className="min-w-0 flex-1" placeholder="Otro nombre…" value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre de la mochila" />
          <Button onClick={() => create(name, "backpack")} disabled={!name.trim()}>Crear</Button>
        </div>
      </Sheet>
    </>
  );
}

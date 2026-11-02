"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Household } from "@/lib/types";
import { Icon, IconTile } from "./icons/Icon";
import { Sheet, Stepper } from "./visual";
import { Button } from "./ui";

export function householdText(a: number, c: number, p: number) {
  return [`${a} adulto${a === 1 ? "" : "s"}`, c ? `${c} niño${c === 1 ? "" : "s"}` : "", p ? `${p} mascota${p === 1 ? "" : "s"}` : ""].filter(Boolean).join(" · ");
}

/** Chip con iconos (adultos, niños, mascotas) que abre los ajustes del hogar. */
export function HouseholdChip() {
  const h = useStore((s) => s.household);
  const setHousehold = useStore((s) => s.setHousehold);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-stone-200 hover:bg-stone-50"
        aria-label="Editar hogar"
      >
        <span className="flex items-center gap-1"><Icon name="user" className="h-4 w-4 text-stone-500" />{h.adults}</span>
        {h.children > 0 && <span className="flex items-center gap-1"><Icon name="baby" className="h-4 w-4 text-stone-500" />{h.children}</span>}
        {h.pets > 0 && <span className="flex items-center gap-1"><Icon name="paw-print" className="h-4 w-4 text-stone-500" />{h.pets}</span>}
        <Pencil className="h-3.5 w-3.5 text-stone-400" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Tu hogar">
        <div className="space-y-4 py-2">
          {([
            ["user", "Adultos", "adults", 1],
            ["baby", "Niños", "children", 0],
            ["paw-print", "Mascotas", "pets", 0],
          ] as const).map(([e, label, key, min]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-base font-medium"><IconTile name={e} tone={key === "pets" ? "orange" : key === "children" ? "sky" : "indigo"} size="sm" />{label}</span>
              <Stepper label={label} min={min} value={h[key]} onChange={(n) => setHousehold({ [key]: n } as Partial<Household>)} />
            </div>
          ))}
          <details className="rounded-xl bg-stone-50 p-3 text-sm">
            <summary className="cursor-pointer font-medium text-stone-600">Ajustes avanzados</summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs text-stone-600">kcal/día adulto
                <input type="number" value={h.kcalAdult} onChange={(e) => setHousehold({ kcalAdult: Number(e.target.value) || 0 })} />
              </label>
              <label className="flex flex-col gap-1 text-xs text-stone-600">kcal/día niño
                <input type="number" value={h.kcalChild} onChange={(e) => setHousehold({ kcalChild: Number(e.target.value) || 0 })} />
              </label>
              <label className="flex flex-col gap-1 text-xs text-stone-600">Agua L/persona/día
                <input type="number" step={0.5} value={h.waterPerPersonL} onChange={(e) => setHousehold({ waterPerPersonL: Number(e.target.value) || 0 })} />
              </label>
              <label className="flex flex-col gap-1 text-xs text-stone-600">Agua L/mascota/día
                <input type="number" step={0.5} value={h.waterPerPetL} onChange={(e) => setHousehold({ waterPerPetL: Number(e.target.value) || 0 })} />
              </label>
            </div>
          </details>
          <Button className="w-full py-3" onClick={() => setOpen(false)}>Listo</Button>
        </div>
      </Sheet>
    </>
  );
}

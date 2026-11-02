"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Household } from "@/lib/types";
import { Sheet, Stepper } from "./visual";
import { Button } from "./ui";

export function householdText(a: number, c: number, p: number) {
  return [`👤 ${a}`, c ? `🧒 ${c}` : "", p ? `🐾 ${p}` : ""].filter(Boolean).join("  ");
}

/** Chip "👤 2 🧒 1 🐾 1 ✏️" que abre los ajustes del hogar. */
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
        {householdText(h.adults, h.children, h.pets)}
        <Pencil className="h-3.5 w-3.5 text-stone-400" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Tu hogar">
        <div className="space-y-4 py-2">
          {([
            ["👤", "Adultos", "adults", 1],
            ["🧒", "Niños", "children", 0],
            ["🐾", "Mascotas", "pets", 0],
          ] as const).map(([e, label, key, min]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-base font-medium"><span className="text-3xl">{e}</span>{label}</span>
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

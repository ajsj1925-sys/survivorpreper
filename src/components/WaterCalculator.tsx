"use client";

import Link from "next/link";
import { useState } from "react";
import { fmtNumber } from "@/lib/calc";

/** Mini calculadora pública para las páginas SEO: da valor sin registro y empuja al panel. */
export function WaterCalculator() {
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(3);
  const [perDay, setPerDay] = useState(3);
  const liters = people * days * perDay;
  const bottles = Math.ceil(liters / 1.5);

  return (
    <div className="not-prose my-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
      <div className="grid grid-cols-3 gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
          Personas
          <input type="number" min={1} value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
          Días
          <input type="number" min={1} value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value)))} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
          L/persona/día
          <input type="number" min={1} step={0.5} value={perDay} onChange={(e) => setPerDay(Math.max(0.5, Number(e.target.value)))} />
        </label>
      </div>
      <p className="mt-4 text-lg">
        Necesitas <b className="text-brand-700">{fmtNumber(liters, 1)} litros</b>, unas{" "}
        <b className="text-brand-700">{bottles} botellas de 1,5 L</b>.
      </p>
      <Link href="/app/kit" className="mt-3 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
        Calcular mi kit completo gratis →
      </Link>
    </div>
  );
}

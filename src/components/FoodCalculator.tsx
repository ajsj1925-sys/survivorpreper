"use client";

import Link from "next/link";
import { useState } from "react";
import { fmtNumber } from "@/lib/calc";
import { DEFAULTS } from "@/lib/config";
import { Icon } from "./icons/Icon";

/** Calculadora pública de comida: calorías totales y su equivalencia en productos habituales. */
export function FoodCalculator() {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [days, setDays] = useState(3);
  const kcal = (adults * DEFAULTS.kcalAdult + children * DEFAULTS.kcalChild) * days;
  // Ejemplo de reparto sin cocinar: 60 % raciones (2.400 kcal), 25 % latas de atún (190), 15 % barritas (220)
  const raciones = Math.ceil((kcal * 0.6) / 2400);
  const latas = Math.ceil((kcal * 0.25) / 190);
  const barritas = Math.ceil((kcal * 0.15) / 220);
  const field = (label: string, v: number, set: (n: number) => void, min: number) => (
    <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
      {label}
      <input type="number" min={min} value={v} onChange={(e) => set(Math.max(min, Number(e.target.value) || min))} />
    </label>
  );
  return (
    <div className="my-6 rounded-3xl border border-brand-100 bg-brand-50 p-5">
      <div className="grid grid-cols-3 gap-3">
        {field("Adultos", adults, setAdults, 0)}
        {field("Niños", children, setChildren, 0)}
        {field("Días", days, setDays, 1)}
      </div>
      <p className="mt-4 text-lg">
        Necesitáis unas <b className="text-brand-700">{fmtNumber(kcal)} kcal</b>. Por ejemplo:
      </p>
      <ul className="!mt-2 grid !list-none gap-2 !pl-0 sm:grid-cols-3">
        {[
          ["package", `${raciones} raciones de emergencia`],
          ["fish", `${latas} latas de atún`],
          ["grains", `${barritas} barritas energéticas`],
        ].map(([ic, t]) => (
          <li key={t} className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-medium ring-1 ring-brand-100">
            <Icon name={ic} className="h-6 w-6 text-amber-600" /> {t}
          </li>
        ))}
      </ul>
      <Link href="/app" className="mt-4 inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
        Calcular mi kit completo gratis →
      </Link>
    </div>
  );
}

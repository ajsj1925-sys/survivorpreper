"use client";

import { useState } from "react";
import { fmtNumber, homeSummary } from "@/lib/calc";
import { mainKitItems, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/components/ui";
import { Icon } from "@/components/icons/Icon";

const STEPS: [string, string, string][] = [
  ["radio", "Enciende la radio", "Sigue las indicaciones oficiales. El móvil puede quedarse sin red."],
  ["flashlight", "Linternas, no velas", "Evitas incendios. Deja una linterna en cada habitación."],
  ["plugs", "Desenchufa aparatos", "Al volver la luz, un pico puede estropearlos. Deja una lámpara encendida para saber cuándo vuelve."],
  ["snowflake", "No abras la nevera", "Cerrada aguanta unas 4 h; el congelador lleno, hasta 48 h."],
  ["battery-charging", "Ahorra batería", "Modo ahorro y brillo al mínimo. Usa el powerbank solo para lo importante."],
  ["drop", "Llena recipientes", "Si aún sale agua del grifo, llena botellas y la bañera."],
  ["hand-heart", "Mira por tus vecinos", "Personas mayores o que dependen de aparatos médicos."],
  ["car-simple", "No cojas el coche", "Semáforos apagados. Sal solo si es necesario."],
  ["phone-call", "112 solo para emergencias", "No colapses la línea con preguntas."],
];

export function BlackoutView() {
  const hydrated = useHydrated();
  const { kit, pantry, household, plan } = useStore();
  const [done, setDone] = useState<number[]>([]);
  const home = hydrated ? homeSummary(mainKitItems(kit), pantry, household) : null;

  return (
    <div className="always-dark -mx-4 -mt-6 min-h-dvh bg-stone-900 px-4 pb-10 pt-6 text-white md:-mx-8 md:-mt-8 md:rounded-3xl md:px-8">
      <div className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/15 text-amber-400"><Icon name="lightning" className="h-12 w-12" /></span>
        <h1 className="mt-2 text-3xl font-black">Modo apagón</h1>
        <p className="text-stone-400">Toca cada paso cuando lo hagas</p>
        <a href="tel:112" className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-xl font-black"><Icon name="phone-call" className="h-6 w-6" /> 112</a>
      </div>

      {home && (
        <div className="mt-6 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl bg-white/10 p-3">
            <Icon name="bowl-food" className="mx-auto h-7 w-7 text-amber-400" />
            <div className="text-xl font-bold">{fmtNumber(home.foodDays, 1)} d</div>
            <div className="text-xs text-stone-400">de comida</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <Icon name="drop" className="mx-auto h-7 w-7 text-sky-400" />
            <div className="text-xl font-bold">{fmtNumber(home.waterDays, 1)} d</div>
            <div className="text-xs text-stone-400">de agua</div>
          </div>
        </div>
      )}

      <ol className="mt-6 space-y-2" data-testid="blackout-steps">
        {STEPS.map(([e, t, d], i) => {
          const ok = done.includes(i);
          return (
            <li key={t}>
              <button onClick={() => setDone(ok ? done.filter((x) => x !== i) : [...done, i])}
                className={cn("flex w-full items-center gap-4 rounded-2xl p-4 text-left transition", ok ? "bg-emerald-600/30" : "bg-white/10")}>
                <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", ok ? "bg-emerald-500 text-white" : "bg-white/10 text-amber-300")}>
                  <Icon name={ok ? "check-circle" : e} className="h-8 w-8" />
                </span>
                <span className="flex-1">
                  <span className={cn("block text-lg font-bold", ok && "line-through opacity-70")}>{t}</span>
                  <span className="block text-sm text-stone-300">{d}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {hydrated && (plan.meetingPointNear || plan.outOfAreaContact) && (
        <div className="mt-6 rounded-2xl bg-white p-4 text-stone-900">
          <div className="flex items-center gap-2 font-bold"><Icon name="users-three" className="h-5 w-5 text-violet-600" /> Vuestro plan</div>
          {plan.meetingPointNear && <div className="mt-1 text-sm">Punto de encuentro: <b>{plan.meetingPointNear}</b></div>}
          {plan.outOfAreaContact && <div className="text-sm">Contacto: <b>{plan.outOfAreaContact}</b></div>}
        </div>
      )}
    </div>
  );
}

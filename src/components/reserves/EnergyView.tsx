"use client";

import Link from "next/link";
import { autonomy, fmtDays, qtyOf } from "@/lib/autonomy";
import { CATALOG_BY_ID } from "@/lib/catalog";
import { useHydrated, useStore } from "@/lib/store";
import { Card } from "@/components/ui";
import { Stepper } from "@/components/visual";
import { IconTile } from "@/components/icons/Icon";

const GROUPS: { title: string; ids: string[] }[] = [
  { title: "Luz", ids: ["frontal", "linterna", "farol", "pilas", "pilas-aaa", "velas"] },
  { title: "Energía", ids: ["powerbank", "solar", "radio"] },
  { title: "Cocina sin luz", ids: ["hornillo", "cartucho-gas", "mechero"] },
];

export function EnergyView() {
  const hydrated = useHydrated();
  const { kit, pantry, household, waterSources, setMainQty } = useStore();
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;
  const a = autonomy(kit, pantry, household, household.goalDays ?? 3, waterSources);
  const r = Object.fromEntries(a.resources.map((x) => [x.id, x]));
  // Lo que se edita aquí es la mochila de CASA; lo de la despensa también cuenta y se muestra aparte
  const inKit = (id: string) => kit.filter((i) => i.catalogId === id && (i.kitId ?? "main") === "main").reduce((s, i) => s + i.qty, 0);
  const inPantry = (id: string) => pantry.filter((l) => l.catalogId === id).reduce((s, l) => s + l.qty, 0);

  const stats = [
    { label: "Horas de luz", value: r.luz.amount, sub: `${fmtDays(r.luz.days)} a 5 h por noche`, icon: "flashlight", tone: "yellow" as const },
    { label: "Cargas de móvil", value: r.energia.amount, sub: Number.isFinite(r.energia.days) ? `${fmtDays(r.energia.days)} · 1 carga por adulto y día` : "con el solar, renovable", icon: "battery-charging", tone: "emerald" as const },
    { label: "Comidas calientes", value: r.cocina.amount, sub: qtyOf(a.inv, "hornillo") ? `${fmtDays(r.cocina.days)} a 1 al día` : "necesitas hornillo", icon: "campfire", tone: "orange" as const },
  ];

  return (
    <>
      <Link href="/app/reservas" className="text-sm text-stone-500">← Reservas</Link>
      <h1 className="mb-4 mt-1 flex items-center gap-2.5 text-2xl font-bold tracking-tight"><IconTile name="lightning" tone="yellow" size="sm" /> Luz, energía y cocina</h1>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <IconTile name={s.icon} tone={s.tone} size="sm" />
            <div className="mt-2 text-xs font-semibold uppercase text-stone-500">{s.label}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-stone-500">{s.sub}</div>
          </Card>
        ))}
      </div>
      {[r.luz.warn, r.cocina.warn].filter(Boolean).map((w) => (
        <p key={w} className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">{w}</p>
      ))}

      {GROUPS.map((g) => (
        <Card key={g.title} className="mb-3">
          <h2 className="mb-2 font-semibold">{g.title}</h2>
          <ul className="space-y-2">
            {g.ids.map((id) => {
              const c = CATALOG_BY_ID[id];
              const extra = inPantry(id);
              return (
                <li key={id} className="flex items-center gap-3">
                  <IconTile name={c.icon} tone="stone" size="sm" />
                  <span className="min-w-0 flex-1 text-sm">{c.name}{extra > 0 && <span className="block text-xs text-stone-400">+{extra} en la despensa</span>}</span>
                  <Stepper label={c.name} value={inKit(id)} onChange={(n) => setMainQty(c, n)} />
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
      <p className="text-[11px] text-stone-400">Estimaciones para planificar: un pack de 4 pilas AA da unas 30 h de luz con un frontal LED; un powerbank de 10.000 mAh, unas 3 cargas de móvil; un cartucho de gas de 230 g, unas 6 comidas calientes.</p>
    </>
  );
}

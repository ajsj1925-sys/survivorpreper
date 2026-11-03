"use client";

import Link from "next/link";
import { useState } from "react";
import { scenarios } from "@/lib/scenarios";
import { mainKitItems, useHydrated, useStore } from "@/lib/store";
import { Card, cn } from "@/components/ui";
import { Icon, IconTile } from "@/components/icons/Icon";

export function ScenariosView() {
  const hydrated = useHydrated();
  const { kit, pantry, household, plan, waterSources, scenarioChecks, toggleScenarioCheck } = useStore();
  const [active, setActive] = useState("apagon");
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;
  const list = scenarios(mainKitItems(kit), pantry, household, plan, waterSources, scenarioChecks);
  const sc = list.find((s) => s.id === active) ?? list[0];
  const done = (s: (typeof list)[number]) => s.checks.filter((c) => c.ok).length;

  return (
    <>
      <Link href="/app/reservas" className="text-sm text-stone-500">← Reservas</Link>
      <h1 className="mb-4 mt-1 flex items-center gap-2.5 text-2xl font-bold tracking-tight"><IconTile name="list-checks" tone="violet" size="sm" /> Escenarios</h1>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {list.map((s) => (
          <button key={s.id} onClick={() => setActive(s.id)} aria-pressed={s.id === sc.id}
            className={cn("rounded-2xl p-3 text-left ring-1 transition", s.id === sc.id ? "bg-stone-900 text-white ring-stone-900" : "bg-white ring-stone-200")}>
            <Icon name={s.icon} className="h-6 w-6" />
            <div className="mt-1 text-sm font-semibold leading-tight">{s.title}</div>
            <div className={cn("text-xs tabular-nums", s.id === sc.id ? "text-stone-300" : "text-stone-500")}>{done(s)}/{s.checks.length} listo</div>
          </button>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold">{sc.title}</h2>
        <p className="text-sm text-stone-600">{sc.intro}</p>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${(done(sc) / sc.checks.length) * 100}%` }} />
        </div>
        <ul className="mt-3 divide-y divide-stone-100" data-testid="scenario-checks">
          {sc.checks.map((c) => (
            <li key={c.id} className="flex items-start gap-3 py-2.5">
              {c.manual ? (
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 p-0" checked={c.ok} onChange={() => toggleScenarioCheck(c.id)} aria-label={c.label} />
              ) : (
                <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", c.ok ? "bg-emerald-500" : "bg-red-400")}>{c.ok ? "✓" : "!"}</span>
              )}
              <span className="text-sm">
                <span className={cn(c.ok ? "text-stone-800" : "font-medium text-stone-900")}>{c.label}</span>
                {c.detail && <span className="block text-xs text-stone-500">{c.detail}</span>}
                {c.manual && <span className="block text-[11px] text-stone-400">Márcalo tú</span>}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/app/compra" className="rounded-full bg-brand-500 px-3 py-1.5 font-medium text-white">Lista de la compra</Link>
          <Link href="/app/agua" className="rounded-full bg-white px-3 py-1.5 ring-1 ring-stone-200">Agua</Link>
          <Link href="/app/energia" className="rounded-full bg-white px-3 py-1.5 ring-1 ring-stone-200">Luz y energía</Link>
        </div>
      </Card>
    </>
  );
}

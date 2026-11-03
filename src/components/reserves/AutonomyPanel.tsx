"use client";

import Link from "next/link";
import { GOALS, autonomy, fmtDays } from "@/lib/autonomy";
import { useStore } from "@/lib/store";
import { track } from "@/lib/track";
import { Card, cn } from "@/components/ui";
import { Icon, IconTile } from "@/components/icons/Icon";

/** Niveles de autonomía: objetivo elegible, días por recurso, punto débil y qué falta. */
export function AutonomyPanel({ compact = false }: { compact?: boolean }) {
  const { kit, pantry, household, waterSources, setHousehold } = useStore();
  const goal = household.goalDays ?? 3;
  const a = autonomy(kit, pantry, household, goal, waterSources);
  const goalLabel = GOALS.find((g) => g.days === goal)?.label ?? `${goal} días`;
  const ok = a.core >= goal;

  return (
    <Card className="mb-4" >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold"><Icon name="gauge" className="h-5 w-5 text-brand-500" /> Autonomía en casa</div>
        {compact && <Link href="/app/reservas" className="text-sm font-medium text-brand-600">Ver todo →</Link>}
      </div>

      <div className="mt-3 flex gap-1.5 overflow-x-auto" role="radiogroup" aria-label="Objetivo de autonomía">
        {GOALS.map((g) => (
          <button key={g.days} role="radio" aria-checked={goal === g.days}
            onClick={() => { setHousehold({ goalDays: g.days }); track("goal_set", { days: g.days }); }}
            className={cn("shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition",
              goal === g.days ? "bg-stone-900 text-white ring-stone-900" : "bg-white text-stone-600 ring-stone-200")}>
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-end gap-3">
        <div className={cn("whitespace-nowrap text-4xl font-black tabular-nums", ok ? "text-emerald-600" : a.core >= goal / 2 ? "text-amber-600" : "text-red-600")} data-testid="core-days">
          {fmtDays(a.core)}
        </div>
        <div className="pb-1 text-sm text-stone-600">
          aguantáis con agua y comida · objetivo <b>{goalLabel}</b>
          {a.reached > 0 && <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Nivel {GOALS.find((g) => g.days === a.reached)?.short}</span>}
        </div>
      </div>

      {a.weakest && a.weakest.days < goal && (
        <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100" data-testid="weakest">
          <b>Punto débil: {a.weakest.label.toLowerCase()}</b> — solo {fmtDays(a.weakest.days)}.{!compact && a.weakest.missing ? ` Te falta: ${a.weakest.missing}.` : ""}
        </p>
      )}

      <ul className="mt-3 space-y-2.5">
        {a.resources.map((r) => {
          const pct = Number.isFinite(r.days) ? Math.min(100, (r.days / goal) * 100) : 100;
          const color = pct >= 100 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
          return (
            <li key={r.id} data-resource={r.id}>
              <div className="flex items-center gap-3">
                <IconTile name={r.icon} tone={r.id === a.weakest?.id && r.days < goal ? "rose" : "stone"} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-xs font-medium text-stone-500">
                    <span>{r.label} <span className="font-normal text-stone-400">· {r.amount}</span></span>
                    <span className="tabular-nums text-stone-800">{fmtDays(r.days)}</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-stone-100">
                    <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
              {!compact && (r.missing || r.warn) && (
                <div className="ml-12 mt-1 space-y-0.5 text-xs">
                  {r.missing && <div className="text-stone-600">Para {goalLabel}: <b>{r.missing}</b> <span className="text-stone-400">({r.perDay})</span></div>}
                  {r.warn && <div className="text-amber-700">{r.warn}</div>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {!compact && <p className="mt-3 text-[11px] text-stone-400">Cuenta la mochila de casa y la despensa, sin lo caducado. Luz, móviles, cocina e higiene son estimaciones para planificar.</p>}
    </Card>
  );
}

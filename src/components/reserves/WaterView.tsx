"use client";

import Link from "next/link";
import { useState } from "react";
import { BATHTUB_L, CISTERN_L, autonomy, extraWaterL, fmtDays } from "@/lib/autonomy";
import { CATALOG_BY_ID } from "@/lib/catalog";
import { daysUntil, parseISODate } from "@/lib/calc";
import { useHydrated, useStore } from "@/lib/store";
import { Button, Card, cn } from "@/components/ui";
import { Stepper } from "@/components/visual";
import { Icon, IconTile } from "@/components/icons/Icon";

const fmt = (n: number, d = 0) => n.toLocaleString("es-ES", { maximumFractionDigits: d });

export function WaterView() {
  const hydrated = useHydrated();
  const { kit, pantry, household, waterSources, setWaterSources, addPantryFromCatalog, restockLot } = useStore();
  const [liters, setLiters] = useState(5);
  const [cloudy, setCloudy] = useState(false);
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;

  const a = autonomy(kit, pantry, household, household.goalDays ?? 3, waterSources);
  const water = a.resources[0];
  const containers = pantry.filter((l) => l.type === "agua" || (l.catalogId && CATALOG_BY_ID[l.catalogId]?.cat === "agua" && l.waterL > 0))
    .sort((x, y) => parseISODate(x.expiresAt).getTime() - parseISODate(y.expiresAt).getTime());
  const extra = extraWaterL(waterSources);
  const drops = Math.ceil(liters * 2 * (cloudy ? 2 : 1));

  return (
    <>
      <Link href="/app/reservas" className="text-sm text-stone-500">← Reservas</Link>
      <h1 className="mb-4 mt-1 flex items-center gap-2.5 text-2xl font-bold tracking-tight"><IconTile name="drop" tone="sky" size="sm" /> Agua</h1>

      <Card className="mb-4">
        <div className="flex items-end gap-3">
          <div className="whitespace-nowrap text-4xl font-black tabular-nums text-sky-600" data-testid="water-days">{fmtDays(water.days)}</div>
          <div className="pb-1 text-sm text-stone-600">de agua de beber · {water.amount} · {water.perDay}</div>
        </div>
        {water.missing && <p className="mt-2 text-sm text-stone-600">Para tu objetivo te faltan <b>{water.missing}</b>.</p>}
      </Card>

      <Card className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Botellas, garrafas y bidones</h2>
          <Link href="/app/despensa" className="text-sm text-brand-600">Despensa →</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["garrafa-8", "agua-5", "bidon-20"] as const).map((id) => {
            const c = CATALOG_BY_ID[id];
            return (
              <button key={id} onClick={() => addPantryFromCatalog(c)} aria-label={`Añadir ${c.name}`}
                className="flex flex-col items-center gap-1 rounded-2xl bg-sky-50 p-3 text-center text-xs font-medium text-sky-900 ring-1 ring-sky-100 active:scale-95">
                <Icon name={c.icon} className="h-7 w-7" /> + {c.name}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-stone-500">El agua del grifo guardada en bidones limpios se renueva cada 6 meses: te avisamos.</p>
        {containers.length > 0 && (
          <ul className="mt-3 divide-y divide-stone-100">
            {containers.map((l) => {
              const d = daysUntil(l.expiresAt);
              return (
                <li key={l.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="flex-1">{l.name} <span className="text-stone-400">×{l.qty}</span></span>
                  <span className={cn("text-xs", d < 30 ? "font-semibold text-red-600" : "text-stone-500")}>{d < 0 ? "Renovar ya" : `Renovar en ${d} d`}</span>
                  {d < 30 && <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => restockLot(l.id)}>Renovada</Button>}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold">Agua de reserva en casa</h2>
        <p className="mt-1 text-xs text-stone-500">No es para beber tal cual: sirve para la higiene y la cisterna, o para beber después de potabilizarla.</p>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm"><Icon name="thermometer-hot" className="h-5 w-5 text-sky-600" /> Termo de agua caliente (litros)</span>
            <div className="flex gap-1">
              {[0, 50, 80, 100].map((v) => (
                <button key={v} onClick={() => setWaterSources({ heaterL: v })} aria-pressed={waterSources.heaterL === v}
                  className={cn("rounded-full px-2.5 py-1 text-xs font-medium ring-1", waterSources.heaterL === v ? "bg-sky-600 text-white ring-sky-600" : "bg-white ring-stone-200")}>{v || "No"}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2"><Icon name="bathtub" className="h-5 w-5 text-sky-600" /> Llenaríamos la bañera al primer aviso (~{BATHTUB_L} L)</span>
            <input type="checkbox" className="h-5 w-5 p-0" checked={waterSources.bathtub} onChange={(e) => setWaterSources({ bathtub: e.target.checked })} />
          </label>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2"><Icon name="toilet" className="h-5 w-5 text-sky-600" /> Cisternas llenas (~{CISTERN_L} L cada una)</span>
            <Stepper label="Cisternas" value={waterSources.cisterns} onChange={(n) => setWaterSources({ cisterns: n })} />
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-900">Reserva extra: <b>{fmt(extra)} L</b>{extra > 0 && ` · unos ${fmtDays(extra / Math.max(1, household.adults + household.children) / 3)} más si la potabilizas`}</p>
      </Card>

      <Card className="mb-4">
        <h2 className="flex items-center gap-2 font-semibold"><Icon name="flask" className="h-5 w-5 text-sky-600" /> Potabilizar agua</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm">Litros a potabilizar</span>
          <Stepper label="Litros" min={1} value={liters} onChange={setLiters} />
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 p-0" checked={cloudy} onChange={(e) => setCloudy(e.target.checked)} /> El agua está turbia o muy fría</label>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-200"><div className="text-xs font-semibold uppercase text-stone-500">Lejía</div><div className="text-2xl font-black tabular-nums" data-testid="drops">{drops} gotas</div><div className="text-xs text-stone-600">y esperar 30 minutos</div></div>
          <div className="rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-200"><div className="text-xs font-semibold uppercase text-stone-500">Hervir</div><div className="text-2xl font-black">1 minuto</div><div className="text-xs text-stone-600">a borbotones, y dejar enfriar</div></div>
          <div className="rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-200"><div className="text-xs font-semibold uppercase text-stone-500">Pastillas</div><div className="text-2xl font-black">Según envase</div><div className="text-xs text-stone-600">cada marca trata distintos litros</div></div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-stone-600">
          <li>Usa solo lejía con la etiqueta <b>«apta para la desinfección del agua de bebida»</b>, sin perfume ni detergente. Si su etiqueta indica otra dosis, manda la etiqueta.</li>
          <li>Si el agua está turbia, fíltrala antes con un paño limpio. Tras 30 minutos debe oler ligeramente a cloro; si no, repite la dosis y espera 15 minutos más.</li>
          <li>Referencia: 2 gotas por litro de lejía doméstica (6 %), según la Agencia de Protección Ambiental de EE. UU. (EPA). Sigue siempre las indicaciones de las autoridades sanitarias.</li>
        </ul>
        <div className="mt-2 flex flex-wrap gap-3 text-xs">
          <a href="https://espanol.epa.gov/node/677" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">EPA: desinfección del agua en emergencias ↗</a>
          <a href="https://www.boe.es/eli/es/rd/1993/03/05/349" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">BOE: lejía apta para agua de bebida ↗</a>
        </div>
      </Card>
    </>
  );
}

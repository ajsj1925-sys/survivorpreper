"use client";

import Link from "next/link";
import { useState } from "react";
import { macroShare, qtyOf, inventory } from "@/lib/autonomy";
import { CATALOG_BY_ID, PANTRY_CATALOG } from "@/lib/catalog";
import { daysUntil, parseISODate } from "@/lib/calc";
import { recipesFor } from "@/lib/meals";
import { mainKitItems, useStore } from "@/lib/store";
import { Card, cn } from "@/components/ui";
import { Stepper } from "@/components/visual";
import { Icon, IconTile } from "@/components/icons/Icon";

/** Rotación, recetas, equilibrio de nutrientes y stock mínimo de la despensa. */
export function PantryExtras() {
  const { kit, pantry, minStock, setMinStock, consumeLot } = useStore();
  const [editMin, setEditMin] = useState(false);
  const main = mainKitItems(kit);
  const inv = inventory(main, pantry);
  const canCook = qtyOf(inv, "hornillo") > 0 && qtyOf(inv, "cartucho-gas") > 0;

  // Consume primero: comida y agua que caduca antes (próximos 60 días)
  const first = pantry
    .filter((l) => (l.type === "alimento" || l.type === "agua") && daysUntil(l.expiresAt) >= 0 && daysUntil(l.expiresAt) <= 60)
    .sort((a, b) => parseISODate(a.expiresAt).getTime() - parseISODate(b.expiresAt).getTime())
    .slice(0, 5);
  const recipes = recipesFor(main, pantry, canCook).slice(0, 3);
  const { total, share } = macroShare(main, pantry);
  const bars = [
    { k: "proteina" as const, label: "Proteína", cls: "bg-rose-500" },
    { k: "hidrato" as const, label: "Hidratos", cls: "bg-amber-400" },
    { k: "grasa" as const, label: "Grasas", cls: "bg-emerald-500" },
    { k: "mixto" as const, label: "Raciones y barritas", cls: "bg-stone-400" },
  ];
  // Mínimos: productos con mínimo o que ya están en la despensa
  const minIds = [...new Set([...Object.keys(minStock), ...pantry.map((l) => l.catalogId).filter(Boolean) as string[]])]
    .filter((id) => CATALOG_BY_ID[id]);
  const have = (id: string) => pantry.filter((l) => l.catalogId === id && daysUntil(l.expiresAt) >= 0).reduce((s, l) => s + l.qty, 0);
  const below = minIds.filter((id) => minStock[id] && have(id) < minStock[id]);

  return (
    <div className="mb-4 grid gap-3 lg:grid-cols-2">
      <Card>
        <h2 className="flex items-center gap-2 font-semibold"><Icon name="arrows-clockwise" className="h-5 w-5 text-brand-500" /> Consume primero</h2>
        {first.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Nada caduca en los próximos 2 meses.</p>
        ) : (
          <ul className="mt-2 space-y-1.5" data-testid="consume-first">
            {first.map((l) => (
              <li key={l.id} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate">{l.name} <span className="text-stone-400">×{l.qty}</span></span>
                <span className={cn("text-xs", daysUntil(l.expiresAt) < 15 ? "font-semibold text-red-600" : "text-amber-700")}>{daysUntil(l.expiresAt)} d</span>
                <button onClick={() => consumeLot(l.id)} className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium hover:bg-stone-200" aria-label={`Gastar uno: ${l.name}`}>Gastar 1</button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-stone-500">Rotación: gasta lo viejo en tu día a día y repón con lo nuevo. Así nunca tiras nada.</p>
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 font-semibold"><Icon name="chef-hat" className="h-5 w-5 text-brand-500" /> Ideas para gastarlo</h2>
        {recipes.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Añade latas, legumbres, arroz o pasta y te propondremos recetas.</p>
        ) : (
          <ul className="mt-2 space-y-2" data-testid="recipes">
            {recipes.map((r) => (
              <li key={r.name} className="text-sm">
                <div className="font-medium">{r.name}{r.cook && <Icon name="fire" className="ml-1 inline h-3.5 w-3.5 text-orange-500" />}</div>
                <div className="text-xs text-stone-600">{r.how}</div>
                {r.missing.length > 0 && <div className="text-xs text-stone-400">Te falta: {r.missing.join(", ")}</div>}
              </li>
            ))}
          </ul>
        )}
        <Link href="/app/menu" className="mt-2 inline-block text-sm font-medium text-brand-600">Menú de emergencia completo →</Link>
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 font-semibold"><Icon name="chart-pie-slice" className="h-5 w-5 text-brand-500" /> Equilibrio de tu reserva</h2>
        {total === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Aún no hay comida en casa.</p>
        ) : (
          <>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full" aria-hidden>
              {bars.map((b) => <div key={b.k} className={b.cls} style={{ width: `${share[b.k] * 100}%` }} />)}
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {bars.map((b) => <li key={b.k} className="flex items-center gap-1.5"><span className={cn("h-2.5 w-2.5 rounded-full", b.cls)} />{b.label} <b className="tabular-nums">{Math.round(share[b.k] * 100)} %</b></li>)}
            </ul>
            {share.proteina < 0.15 && <p className="mt-2 text-xs text-amber-700">Poca proteína: añade legumbres, atún, sardinas o carne en conserva.</p>}
            {share.grasa < 0.1 && <p className="mt-1 text-xs text-amber-700">Pocas grasas: el aceite y los frutos secos dan mucha energía en poco espacio.</p>}
          </>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold"><Icon name="stack" className="h-5 w-5 text-brand-500" /> Stock mínimo</h2>
          <button onClick={() => setEditMin(!editMin)} className="text-sm font-medium text-brand-600">{editMin ? "Hecho" : "Editar"}</button>
        </div>
        <p className="mt-1 text-xs text-stone-500">Si bajas del mínimo, pasa solo a la lista de la compra.</p>
        {below.length > 0 && !editMin && (
          <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-800">Bajo el mínimo: {below.map((id) => CATALOG_BY_ID[id].name).join(", ")}. <Link href="/app/compra" className="underline">Ver compra</Link></p>
        )}
        {editMin ? (
          <ul className="mt-2 max-h-80 space-y-2 overflow-y-auto">
            {[...new Set([...minIds, ...PANTRY_CATALOG.filter((c) => c.pantry === "alimento" || c.pantry === "agua").map((c) => c.id)])].map((id) => {
              const c = CATALOG_BY_ID[id];
              return (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <IconTile name={c.icon} tone="stone" size="sm" />
                  <span className="min-w-0 flex-1">{c.name} <span className="block text-xs text-stone-400">tienes {have(id)}</span></span>
                  <Stepper label={`Mínimo ${c.name}`} value={minStock[id] ?? 0} onChange={(n) => setMinStock(id, n)} />
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(minStock).length === 0 && <li className="text-stone-500">Aún no has puesto mínimos. Pulsa «Editar».</li>}
            {(Object.entries(minStock) as [string, number][]).map(([id, n]) => (
              <li key={id} className="flex justify-between"><span>{CATALOG_BY_ID[id]?.name}</span><span className={cn("tabular-nums", have(id) < n ? "font-semibold text-violet-700" : "text-stone-500")}>{have(id)} / {n}</span></li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

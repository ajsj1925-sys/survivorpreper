"use client";

import { Lock, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { addDays, daysUntil, expiryLevel, fmtNumber, formatDays, kitSummary, toISODate, today } from "@/lib/calc";
import { CATALOG, CAT_META, guessCatalog } from "@/lib/catalog";
import { amazonSearchUrl, DEFAULTS } from "@/lib/config";
import { activeEssentials, essentialCovered } from "@/lib/essentials";
import { recommendationStatus } from "@/lib/recommend";
import { useHydrated, useStore, useUI } from "@/lib/store";
import type { KitCategory } from "@/lib/types";
import { EmailCapture } from "@/components/EmailCapture";
import { HouseholdChip } from "@/components/HouseholdChip";
import { ProductPicker } from "@/components/ProductPicker";
import { Button, Card, cn } from "@/components/ui";
import { Meter, Ring, Sheet, Stepper } from "@/components/visual";

const EXPIRY_CHIPS: [string, number | null][] = [["Sin fecha", null], ["6 meses", 183], ["1 año", 365], ["2 años", 730], ["5 años", 1825]];

export function KitView() {
  const hydrated = useHydrated();
  const s = useStore();
  const openPaywall = useUI((u) => u.openPaywall);
  const [recOpen, setRecOpen] = useState(false);

  const sum = useMemo(() => kitSummary(s.kit, s.household), [s.kit, s.household]);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const i of s.kit) if (i.catalogId) m[i.catalogId] = (m[i.catalogId] ?? 0) + i.qty;
    return m;
  }, [s.kit]);
  const ess = activeEssentials(s.household);
  const covered = ess.filter((e) => essentialCovered(e, s.kit, s.checkedEssentials));
  const pool = useMemo(() => CATALOG.filter((c) => c.cat !== "mascotas" || s.household.pets > 0), [s.household.pets]);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;

  const pct = (sum.autonomyHours / DEFAULTS.targetHours) * 100;
  const ringColor = pct >= 100 ? "#059669" : pct >= 50 ? "#d97706" : "#dc2626";
  const overweight = sum.weightPerAdultKg > DEFAULTS.maxBagKgPerAdult;
  const rec = recommendationStatus(s.household, s.kit);
  const recDone = rec.filter((r) => r.have >= r.target).length;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">🎒 Kit 72 h</h1>
        <HouseholdChip />
      </div>

      {/* Panel visual */}
      <Card className="mb-4 flex flex-col items-center gap-5 sm:flex-row">
        <Ring pct={pct} color={ringColor} size={150} stroke={14}>
          <span data-testid="autonomy" className="text-3xl font-bold tabular-nums" style={{ color: ringColor }}>
            {fmtNumber(Math.floor(sum.autonomyHours))} h
          </span>
          <span className="text-xs text-stone-500">de 72 h</span>
        </Ring>
        <div className="w-full flex-1 space-y-3">
          <Meter emoji="🥫" label="Comida" value={sum.foodDays} max={3} display={`${fmtNumber(sum.foodDays, 1)} / 3 días`} />
          <Meter emoji="💧" label="Agua" value={sum.waterDays} max={3} display={`${fmtNumber(sum.waterDays, 1)} / 3 días`} />
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>🎒</span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-xs font-medium text-stone-500">
                <span>Peso por adulto</span>
                <span className={cn("tabular-nums", overweight ? "text-amber-600" : "text-stone-800")}>
                  {fmtNumber(sum.weightPerAdultKg, 1)} / {DEFAULTS.maxBagKgPerAdult} kg {overweight && "⚠️"}
                </span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-stone-100">
                <div className={cn("h-full rounded-full", overweight ? "bg-amber-500" : "bg-sky-500")}
                  style={{ width: `${Math.min(100, (sum.weightPerAdultKg / DEFAULTS.maxBagKgPerAdult) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {sum.expired.length > 0 && (
        <div role="alert" className="mb-4 flex items-center gap-3 rounded-2xl bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
          <span className="text-2xl">⏰</span>
          <span><b>Caducado:</b> {sum.expired.map((i) => `${i.emoji ?? ""} ${i.name}`).join(", ")}</span>
        </div>
      )}

      {/* Esenciales como insignias */}
      <Card className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Imprescindibles</h2>
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-sm font-bold text-brand-700 tabular-nums">{covered.length}/{ess.length}</span>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
          {ess.map((e) => {
            const ok = covered.includes(e);
            return (
              <button key={e.id} onClick={() => s.toggleEssential(e.id)} aria-pressed={ok} aria-label={e.label}
                className="flex flex-col items-center gap-1">
                <span className={cn("relative flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition",
                  ok ? "bg-emerald-50 ring-2 ring-emerald-500" : "bg-stone-100 opacity-50 grayscale")}>
                  {e.emoji}
                  {ok && <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">✓</span>}
                </span>
                <span className={cn("text-[11px] leading-tight", ok ? "text-stone-700" : "text-stone-400")}>{e.label}</span>
              </button>
            );
          })}
        </div>
        {covered.length < ess.length && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
            {ess.filter((e) => !covered.includes(e)).slice(0, 4).map((e) => (
              <a key={e.id} href={amazonSearchUrl(e.amazonQuery)} target="_blank" rel="sponsored noopener noreferrer"
                className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200">
                {e.emoji} Comprar {e.label.toLowerCase()} ↗
              </a>
            ))}
            <span className="w-full text-[10px] text-stone-400">Enlaces de afiliado: si compras, recibimos una pequeña comisión sin coste para ti.</span>
          </div>
        )}
      </Card>

      {/* Kit recomendado */}
      <button onClick={() => setRecOpen(true)}
        className="mb-4 flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-brand-500 to-orange-400 p-4 text-left text-white shadow-sm transition active:scale-[0.99]">
        <Sparkles className="h-8 w-8 shrink-0" />
        <div className="flex-1">
          <div className="font-semibold">Kit recomendado para tu hogar</div>
          <div className="text-sm text-white/85">{recDone} de {rec.length} cosas listas · toca para completarlo</div>
        </div>
        <span className="text-2xl">›</span>
      </button>

      {/* Añadir tocando */}
      <Card className="mb-4">
        <h2 className="mb-3 font-semibold">Añade lo que tienes <span className="font-normal text-stone-500">· toca para sumar</span></h2>
        <ProductPicker pool={pool} counts={counts} onAdd={(c) => s.addFromCatalog(c)} onDec={(c) => s.decFromCatalog(c.id)} />
        <CustomItem />
      </Card>

      {/* Lo que llevas */}
      {s.kit.length > 0 && (
        <Card className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">En tu mochila</h2>
            <button onClick={() => openPaywall("Varios kits (casa, coche, trabajo)")} className="flex items-center gap-1 text-xs font-medium text-stone-500">
              <Lock className="h-3 w-3 text-brand-500" /> Varios kits
            </button>
          </div>
          <ul className="flex flex-wrap gap-2" data-testid="kit-list">
            {s.kit.map((i) => {
              const lvl = i.expiresAt ? expiryLevel(i.expiresAt) : null;
              return (
                <li key={i.id} className={cn("flex items-center gap-2 rounded-full py-1 pl-2 pr-1 text-sm ring-1",
                  lvl === "expired" ? "bg-red-50 ring-red-300" : lvl === "red" ? "bg-amber-50 ring-amber-300" : "bg-stone-50 ring-stone-200")}>
                  <span className="text-lg">{i.emoji ?? CAT_META[i.category].emoji}</span>
                  <span className="max-w-36 truncate font-medium">{i.name}</span>
                  {(lvl === "expired" || lvl === "red") && i.expiresAt && (
                    <span className="text-[11px] font-semibold text-red-600">{formatDays(daysUntil(i.expiresAt))}</span>
                  )}
                  <span className="flex items-center rounded-full bg-white ring-1 ring-stone-200">
                    <button aria-label={`Quitar uno de ${i.name}`} className="px-2 text-stone-500"
                      onClick={() => (i.qty > 1 ? s.updateKitItem(i.id, { qty: i.qty - 1 }) : s.removeKitItem(i.id))}>−</button>
                    <span className="w-5 text-center font-semibold tabular-nums">{i.qty}</span>
                    <button aria-label={`Añadir uno de ${i.name}`} className="px-2 text-stone-500"
                      onClick={() => s.updateKitItem(i.id, { qty: i.qty + 1 })}>+</button>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <EmailCapture source="kit" />

      <Sheet open={recOpen} onClose={() => setRecOpen(false)} title="✨ Kit recomendado">
        <p className="mb-3 text-sm text-stone-500">Calculado para tu hogar y 72 horas. Ajusta lo que ya tienes.</p>
        <ul className="divide-y divide-stone-100" data-testid="rec-list">
          {rec.map((r) => (
            <li key={r.item.id} className="flex items-center gap-3 py-2">
              <span className="text-2xl">{r.item.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{r.item.name}</div>
                <div className={cn("text-xs", r.have >= r.target ? "text-emerald-600" : "text-stone-500")}>
                  {r.have >= r.target ? "✓ Listo" : `Faltan ${r.target - r.have}`} · objetivo {r.target}
                </div>
              </div>
              <Stepper label={r.item.name} value={r.have} onChange={(n) => s.setCatalogQty(r.item, n)} />
            </li>
          ))}
        </ul>
        <div className="sticky bottom-0 mt-3 grid grid-cols-2 gap-2 bg-white pt-3">
          <Button variant="secondary" onClick={() => rec.forEach((r) => r.have < r.target && s.setCatalogQty(r.item, r.target))}>
            Lo tengo todo
          </Button>
          <Link href="/app/compra" onClick={() => setRecOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <ShoppingCart className="h-4 w-4" /> Lista de compra
          </Link>
        </div>
      </Sheet>
    </>
  );
}

/** Para lo que no está en el catálogo: pocos campos y con valores sugeridos. */
function CustomItem() {
  const addKitItem = useStore((s) => s.addKitItem);
  const [name, setName] = useState("");
  const [cat, setCat] = useState<KitCategory>("otro");
  const [qty, setQty] = useState(1);
  const [kcal, setKcal] = useState(0);
  const [water, setWater] = useState(0);
  const [shelf, setShelf] = useState<number | null>(null);

  function onName(v: string) {
    setName(v);
    const g = guessCatalog(v);
    if (g) {
      setCat(g.cat);
      setKcal(g.kcal);
      setWater(g.waterL);
      setShelf(g.shelfDays);
    }
  }

  function save() {
    if (!name.trim()) return;
    const g = guessCatalog(name);
    addKitItem({
      name: name.trim(), category: cat, qty, kcal, waterL: water, weightG: g?.weightG ?? 200, emoji: g?.emoji,
      expiresAt: shelf ? toISODate(addDays(today(), shelf)) : null,
    });
    setName(""); setQty(1); setKcal(0); setWater(0); setShelf(null); setCat("otro");
  }

  return (
    <details className="mt-4 rounded-2xl bg-stone-50 p-3">
      <summary className="cursor-pointer text-sm font-medium text-stone-600">➕ ¿No está? Añádelo a mano</summary>
      <div className="mt-3 space-y-3">
        <input className="w-full" placeholder="Nombre (ej: Lata de mejillones)" value={name} onChange={(e) => onName(e.target.value)} aria-label="Nombre del producto" />
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CAT_META) as KitCategory[]).map((k) => (
            <button key={k} type="button" onClick={() => setCat(k)}
              className={cn("rounded-full px-2.5 py-1 text-xs", cat === k ? "bg-stone-900 text-white" : "bg-white ring-1 ring-stone-200")}>
              {CAT_META[k].emoji} {CAT_META[k].label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Stepper label="Cantidad" min={1} value={qty} onChange={setQty} />
          {cat === "comida" && (
            <label className="flex items-center gap-2 text-sm">🔥 <input type="number" className="w-24" value={kcal || ""} placeholder="kcal" onChange={(e) => setKcal(Number(e.target.value) || 0)} aria-label="kcal" /> kcal</label>
          )}
          {cat === "agua" && (
            <label className="flex items-center gap-2 text-sm">💧 <input type="number" step={0.5} className="w-20" value={water || ""} placeholder="L" onChange={(e) => setWater(Number(e.target.value) || 0)} aria-label="litros" /> L</label>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="self-center text-xs text-stone-500">📅 Caduca en</span>
          {EXPIRY_CHIPS.map(([l, d]) => (
            <button key={l} type="button" onClick={() => setShelf(d)}
              className={cn("rounded-full px-2.5 py-1 text-xs", shelf === d ? "bg-brand-500 text-white" : "bg-white ring-1 ring-stone-200")}>{l}</button>
          ))}
        </div>
        <Button className="w-full" onClick={save} disabled={!name.trim()}>Añadir</Button>
      </div>
    </details>
  );
}

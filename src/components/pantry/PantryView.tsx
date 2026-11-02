"use client";

import { Lock, Plus, ScanLine, X } from "lucide-react";
import { useMemo, useState } from "react";
import { daysUntil, expiryLevel, fmtNumber, formatDays, homeSummary, lifePct, parseISODate } from "@/lib/calc";
import { mainKitItems, useHydrated, useStore, useUI } from "@/lib/store";
import type { PantryLot, PantryType } from "@/lib/types";
import { Card, cn } from "@/components/ui";
import { Icon, IconTile } from "@/components/icons/Icon";
import type { Tone } from "@/lib/catalog";
import { AddLotSheet, type DraftProduct } from "./AddLotSheet";
import { Scanner } from "./Scanner";

const TYPES: [PantryType | "todos", string, string][] = [["todos", "Todo", "sparkle"], ["alimento", "Comida", "bowl-food"], ["agua", "Agua", "drop"], ["medicina", "Medicinas", "pill"], ["higiene", "Higiene", "hand-soap"], ["otro", "Otro", "package"]];

// Color de la baldosa de cada lote según su tipo
const TYPE_TONE: Record<PantryType, Tone> = { alimento: "amber", agua: "sky", medicina: "rose", higiene: "teal", otro: "stone" };

const GROUPS = [
  { id: "ya", title: "Consumir ya", icon: "warning-circle", tile: "rose" as Tone, match: (d: number) => d < 30, tone: "text-red-600" },
  { id: "pronto", title: "Pronto", icon: "clock-countdown", tile: "amber" as Tone, match: (d: number) => d >= 30 && d < 183, tone: "text-amber-600" },
  { id: "bien", title: "Bien", icon: "check-circle", tile: "emerald" as Tone, match: (d: number) => d >= 183, tone: "text-emerald-600" },
];

export function PantryView() {
  const hydrated = useHydrated();
  const { pantry, kit, household, consumeLot, restockLot, removePantryLot } = useStore();
  const openPaywall = useUI((u) => u.openPaywall);
  const [filter, setFilter] = useState<PantryType | "todos">("todos");
  const [addOpen, setAddOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanned, setScanned] = useState<DraftProduct | null>(null);

  const lots = useMemo(
    () => pantry.filter((l) => filter === "todos" || l.type === filter)
      .sort((a, b) => parseISODate(a.expiresAt).getTime() - parseISODate(b.expiresAt).getTime()),
    [pantry, filter],
  );
  const home = homeSummary(mainKitItems(kit), pantry, household);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;

  const groupCount = (g: (typeof GROUPS)[number]) => pantry.filter((l) => g.match(daysUntil(l.expiresAt))).length;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight"><IconTile name="basket" tone="amber" size="sm" /> Despensa</h1>
        <button onClick={() => openPaywall("Avisos de caducidad por email")}
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-stone-200">
          <Lock className="h-3 w-3 text-brand-500" /> <Icon name="bell-ringing" className="h-4 w-4" /> Avisos
        </button>
      </div>

      {/* Resumen */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {GROUPS.map((g) => (
          <Card key={g.id} className="p-3 text-center">
            <IconTile name={g.icon} tone={g.tile} size="sm" className="mx-auto" />
            <div className={cn("text-2xl font-bold tabular-nums", g.tone)} data-testid={`count-${g.id}`}>{groupCount(g)}</div>
            <div className="text-[11px] text-stone-500">{g.title}</div>
          </Card>
        ))}
      </div>
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-sky-50 p-3 ring-1 ring-sky-100">
        <IconTile name="house" tone="sky" size="md" className="bg-white" />
        <div className="text-sm">
          <div>Con kit + despensa tu casa aguanta <b data-testid="home-days">{fmtNumber(home.days, 1)} días</b></div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-stone-500"><Icon name="bowl-food" className="h-4 w-4 text-amber-600" /> {fmtNumber(home.foodDays, 1)} días de comida · <Icon name="drop" className="h-4 w-4 text-sky-600" /> {fmtNumber(home.waterDays, 1)} de agua</div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button onClick={() => { setScanned(null); setAddOpen(true); }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4 font-semibold text-white shadow-sm active:scale-[0.98]">
          <Plus className="h-5 w-5" /> Añadir
        </button>
        <button onClick={() => setScanOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 font-semibold shadow-sm ring-1 ring-stone-200 active:scale-[0.98]">
          <ScanLine className="h-5 w-5" /> Escanear
        </button>
      </div>

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none]">
        {TYPES.map(([t, l, ic]) => (
          <button key={t} onClick={() => setFilter(t)}
            className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
              filter === t ? "bg-stone-900 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200")}>
            <Icon name={ic} className="h-4 w-4" /> {l}
          </button>
        ))}
      </div>

      {lots.length === 0 ? (
        <Card className="py-10 text-center">
          <IconTile name="basket" tone="amber" size="xl" className="mx-auto" />
          <p className="mt-3 font-medium">Tu despensa está vacía</p>
          <p className="text-sm text-stone-500">Pulsa «Añadir» y toca lo que tienes. La caducidad se calcula sola.</p>
        </Card>
      ) : (
        <div className="space-y-5" data-testid="pantry-groups">
          {GROUPS.map((g) => {
            const items = lots.filter((l) => g.match(daysUntil(l.expiresAt)));
            if (!items.length) return null;
            return (
              <section key={g.id}>
                <h2 className={cn("mb-2 text-sm font-semibold", g.tone)}><Icon name={g.icon} className="mr-1 inline h-4 w-4 align-[-3px]" />{g.title} · {items.length}</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((l) => (
                    <LotCard key={l.id} lot={l} onConsume={() => consumeLot(l.id)} onRestock={() => restockLot(l.id)} onDelete={() => removePantryLot(l.id)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <AddLotSheet open={addOpen} onClose={() => { setAddOpen(false); setScanned(null); }} initial={scanned} />
      <Scanner open={scanOpen} onClose={() => setScanOpen(false)}
        onFound={(p) => { setScanOpen(false); setScanned(p); setAddOpen(true); }} />
    </>
  );
}

function LotCard({ lot, onConsume, onRestock, onDelete }: { lot: PantryLot; onConsume: () => void; onRestock: () => void; onDelete: () => void }) {
  const days = daysUntil(lot.expiresAt);
  const lvl = expiryLevel(lot.expiresAt);
  const life = lifePct(lot.addedAt, lot.expiresAt);
  const bar = lvl === "green" ? "bg-emerald-500" : lvl === "yellow" ? "bg-amber-500" : "bg-red-500";
  return (
    <div data-level={lvl} data-name={lot.name}
      className={cn("rounded-2xl bg-white p-3 shadow-sm ring-1", lvl === "expired" ? "ring-red-300" : "ring-stone-200")}>
      <div className="flex items-start gap-3">
        <IconTile name={lot.icon ?? "package"} tone={TYPE_TONE[lot.type]} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="truncate font-semibold">{lot.name}</div>
            <button onClick={onDelete} aria-label={`Borrar ${lot.name}`} className="-mr-1 -mt-1 rounded-full p-1 text-stone-300 hover:text-red-500">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-stone-500">×{lot.qty} {lot.unit} · {lot.location || "Despensa"}</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
            <div className={cn("h-full rounded-full", bar)} style={{ width: `${Math.max(lvl === "expired" ? 100 : 4, life)}%` }} />
          </div>
          <div className={cn("mt-1 text-xs font-medium", lvl === "expired" || lvl === "red" ? "text-red-600" : "text-stone-500")}>
            {days < 0 ? formatDays(days) : `Caduca en ${formatDays(days)}`}
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={onConsume} aria-label={`Consumido ${lot.name}`}
          className="rounded-xl bg-stone-100 py-2 text-sm font-medium hover:bg-stone-200">✓ Consumido</button>
        <button onClick={onRestock} aria-label={`Repuesto ${lot.name}`}
          className="rounded-xl bg-stone-100 py-2 text-sm font-medium hover:bg-stone-200">↻ Repuesto</button>
      </div>
    </div>
  );
}

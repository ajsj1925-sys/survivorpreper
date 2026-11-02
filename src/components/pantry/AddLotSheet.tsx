"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { addDays, formatDays, toISODate, today, daysUntil } from "@/lib/calc";
import { PANTRY_CATALOG, type CatalogItem } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import type { PantryType } from "@/lib/types";
import { ProductPicker } from "@/components/ProductPicker";
import { Button, cn } from "@/components/ui";
import { Sheet, Stepper } from "@/components/visual";

export interface DraftProduct {
  name: string;
  emoji: string;
  type: PantryType;
  unit: string;
  kcal: number;
  waterL: number;
  shelfDays: number;
  catalogId?: string;
  barcode?: string;
}

export function draftFromCatalog(c: CatalogItem): DraftProduct {
  return { name: c.name, emoji: c.emoji, type: c.pantry ?? "otro", unit: c.unit, kcal: c.kcal, waterL: c.waterL, shelfDays: c.shelfDays ?? 365, catalogId: c.id };
}

const EXPIRY: [string, number][] = [["1 mes", 30], ["3 meses", 91], ["6 meses", 183], ["1 año", 365], ["2 años", 730]];
const PLACES: [string, string][] = [["🏠", "Despensa"], ["🧊", "Nevera"], ["📦", "Trastero"], ["🩹", "Botiquín"], ["🚗", "Coche"]];

/** Añadir en 2 toques: eliges producto → confirmas (caducidad ya estimada). */
export function AddLotSheet({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: DraftProduct | null }) {
  const addPantryLot = useStore((s) => s.addPantryLot);
  const [product, setProduct] = useState<DraftProduct | null>(null);
  const [qty, setQty] = useState(1);
  const [expires, setExpires] = useState("");
  const [place, setPlace] = useState("Despensa");

  useEffect(() => {
    if (!open) return;
    if (initial) pick(initial);
    else setProduct(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  function pick(p: DraftProduct) {
    setProduct(p);
    setQty(1);
    setExpires(toISODate(addDays(today(), p.shelfDays)));
    setPlace(p.type === "medicina" ? "Botiquín" : "Despensa");
  }

  function save() {
    if (!product || !expires) return;
    addPantryLot({
      name: product.name, emoji: product.emoji, type: product.type, unit: product.unit, qty, kcal: product.kcal,
      waterL: product.waterL, expiresAt: expires, location: place, catalogId: product.catalogId, barcode: product.barcode,
    });
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={product ? "Confirmar" : "¿Qué has comprado?"}>
      {!product ? (
        <div className="pb-2">
          <ProductPicker pool={PANTRY_CATALOG} onAdd={(c) => pick(draftFromCatalog(c))} compact />
        </div>
      ) : (
        <div className="space-y-5 pb-2">
          <div className="flex items-center gap-3">
            {!initial && (
              <button onClick={() => setProduct(null)} aria-label="Volver" className="rounded-full p-1.5 hover:bg-stone-100">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <span className="text-5xl">{product.emoji}</span>
            <div>
              <div className="text-lg font-semibold leading-tight">{product.name}</div>
              {product.kcal > 0 && <div className="text-sm text-stone-500">🔥 {product.kcal} kcal / {product.unit}</div>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">¿Cuántos?</span>
            <Stepper label="Cantidad" min={1} value={qty} onChange={setQty} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">📅 Caduca</span>
              <span className="text-sm text-stone-500">{expires && formatDays(daysUntil(expires))}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPIRY.map(([l, d]) => {
                const iso = toISODate(addDays(today(), d));
                return (
                  <button key={l} onClick={() => setExpires(iso)}
                    className={cn("rounded-full px-3 py-1.5 text-sm", expires === iso ? "bg-brand-500 text-white" : "bg-stone-100")}>
                    {l}
                  </button>
                );
              })}
              <input type="date" aria-label="Fecha exacta" value={expires} onChange={(e) => setExpires(e.target.value)} className="rounded-full py-1" />
            </div>
            <p className="mt-1.5 text-xs text-stone-400">Ya viene estimada según el producto. Cámbiala solo si quieres afinar.</p>
          </div>

          <div>
            <div className="mb-2 font-medium">¿Dónde lo guardas?</div>
            <div className="flex flex-wrap gap-2">
              {PLACES.map(([e, l]) => (
                <button key={l} onClick={() => setPlace(l)}
                  className={cn("rounded-full px-3 py-1.5 text-sm", place === l ? "bg-stone-900 text-white" : "bg-stone-100")}>
                  {e} {l}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full py-3 text-base" onClick={save}>Guardar en la despensa</Button>
        </div>
      )}
    </Sheet>
  );
}

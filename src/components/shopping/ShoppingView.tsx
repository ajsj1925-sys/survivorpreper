"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { amazonSearchUrl } from "@/lib/config";
import { shoppingList } from "@/lib/shopping";
import { useHydrated, useStore } from "@/lib/store";
import { Card, cn } from "@/components/ui";

const REASON = {
  caducado: { label: "Caducado", cls: "bg-red-100 text-red-700" },
  caduca: { label: "Caduca pronto", cls: "bg-amber-100 text-amber-800" },
  falta: { label: "Falta en el kit", cls: "bg-stone-100 text-stone-600" },
};

export function ShoppingView() {
  const hydrated = useHydrated();
  const { household, kit, pantry, addFromCatalog, restockLot } = useStore();
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;
  const lines = shoppingList(household, kit, pantry);

  async function copy() {
    const txt = lines.map((l) => `☐ ${l.name} ×${l.qty}`).join("\n");
    if (navigator.share) await navigator.share({ title: "Lista de la compra", text: txt }).catch(() => {});
    else await navigator.clipboard?.writeText(txt);
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">🛒 Compra</h1>
        {lines.length > 0 && (
          <button onClick={copy} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-stone-200">📤 Enviar lista</button>
        )}
      </div>
      <p className="mb-4 text-sm text-stone-500">Se hace sola: lo que falta de tu kit recomendado y lo que caduca en la despensa.</p>

      {lines.length === 0 ? (
        <Card className="py-10 text-center">
          <div className="text-5xl">🎉</div>
          <p className="mt-3 font-medium">No te falta nada</p>
          <Link href="/app" className="text-sm text-brand-600">Volver al inicio</Link>
        </Card>
      ) : (
        <ul className="space-y-2" data-testid="shopping-list">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200">
              <span className="text-3xl">{l.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{l.name} <span className="text-stone-400">×{l.qty}</span></div>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", REASON[l.reason].cls)}>{REASON[l.reason].label}</span>
              </div>
              <a href={amazonSearchUrl(l.name)} target="_blank" rel="sponsored noopener noreferrer"
                className="rounded-full bg-stone-100 px-3 py-2 text-xs font-medium hover:bg-stone-200">Comprar ↗</a>
              <button
                aria-label={`Ya lo tengo: ${l.name}`}
                onClick={() => (l.lotId ? restockLot(l.lotId) : l.catalog && addFromCatalog(l.catalog, l.qty))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm active:scale-95">
                <Check className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-[11px] text-stone-400">✓ = ya lo tengo (se suma al kit o renueva la fecha). «Comprar» son enlaces de afiliado.</p>
    </>
  );
}

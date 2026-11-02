import { CATALOG_BY_ID, type CatalogItem } from "./catalog";
import { daysUntil } from "./calc";
import { recommendationStatus } from "./recommend";
import type { Household, KitItem, PantryLot } from "./types";

export interface ShopLine {
  key: string;
  emoji: string;
  name: string;
  qty: number;
  reason: "falta" | "caduca" | "caducado";
  catalog?: CatalogItem;
  lotId?: string;
}

/** Lista de la compra automática: lo que falta del kit recomendado + lo que caduca en la despensa. */
export function shoppingList(h: Household, kit: KitItem[], pantry: PantryLot[]): ShopLine[] {
  const lines: ShopLine[] = [];
  for (const r of recommendationStatus(h, kit)) {
    if (r.have < r.target) {
      lines.push({ key: `rec-${r.item.id}`, emoji: r.item.emoji, name: r.item.name, qty: r.target - r.have, reason: "falta", catalog: r.item });
    }
  }
  for (const l of pantry) {
    const d = daysUntil(l.expiresAt);
    if (d < 30) {
      lines.push({
        key: `lot-${l.id}`, emoji: l.emoji ?? "📦", name: l.name, qty: l.qty, reason: d < 0 ? "caducado" : "caduca",
        catalog: l.catalogId ? CATALOG_BY_ID[l.catalogId] : undefined, lotId: l.id,
      });
    }
  }
  const order = { caducado: 0, caduca: 1, falta: 2 };
  return lines.sort((a, b) => order[a.reason] - order[b.reason]);
}

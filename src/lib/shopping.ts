import { CATALOG_BY_ID, type CatalogItem } from "./catalog";
import { daysUntil } from "./calc";
import { recommendationStatus } from "./recommend";
import type { Household, KitItem, PantryLot } from "./types";

export interface ShopLine {
  key: string;
  icon: string;
  name: string;
  qty: number;
  reason: "falta" | "caduca" | "caducado" | "minimo";
  catalog?: CatalogItem;
  lotId?: string;
}

/** Lista de la compra automática: lo que falta del kit recomendado + lo que caduca en la despensa. */
export function shoppingList(h: Household, kit: KitItem[], pantry: PantryLot[], minStock: Record<string, number> = {}): ShopLine[] {
  const lines: ShopLine[] = [];
  // Stock mínimo de la despensa: si bajas del mínimo, se repone
  for (const [id, min] of Object.entries(minStock)) {
    const c = CATALOG_BY_ID[id];
    if (!c) continue;
    const have = pantry.filter((l) => l.catalogId === id && daysUntil(l.expiresAt) >= 0).reduce((s, l) => s + l.qty, 0);
    if (have < min) lines.push({ key: `min-${id}`, icon: c.icon, name: c.name, qty: min - have, reason: "minimo", catalog: c });
  }
  for (const r of recommendationStatus(h, kit)) {
    if (r.have < r.target) {
      lines.push({ key: `rec-${r.item.id}`, icon: r.item.icon, name: r.item.name, qty: r.target - r.have, reason: "falta", catalog: r.item });
    }
  }
  for (const l of pantry) {
    const d = daysUntil(l.expiresAt);
    if (d < 30) {
      lines.push({
        key: `lot-${l.id}`, icon: l.icon ?? "package", name: l.name, qty: l.qty, reason: d < 0 ? "caducado" : "caduca",
        catalog: l.catalogId ? CATALOG_BY_ID[l.catalogId] : undefined, lotId: l.id,
      });
    }
  }
  const order = { caducado: 0, caduca: 1, minimo: 2, falta: 3 };
  return lines.sort((a, b) => order[a.reason] - order[b.reason]);
}

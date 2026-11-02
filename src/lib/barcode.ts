import { guessCatalog } from "./catalog";
import type { PantryType } from "./types";

export interface ScannedProduct {
  barcode: string;
  name: string;
  icon: string;
  kcal: number; // por unidad (envase)
  type: PantryType;
  shelfDays: number;
  catalogId?: string;
}

/** Busca el código en Open Food Facts (base de datos pública y gratuita, sin clave). */
export async function lookupBarcode(code: string): Promise<ScannedProduct | null> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,product_name_es,brands,nutriments,product_quantity`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;
  const p = data.product;
  const name = [p.product_name_es || p.product_name, p.brands?.split(",")[0]].filter(Boolean).join(" · ") || `Producto ${code}`;
  const kcal100 = Number(p.nutriments?.["energy-kcal_100g"] ?? 0);
  const grams = Number(p.product_quantity ?? 0);
  const guess = guessCatalog(name);
  return {
    barcode: code,
    name,
    icon: guess?.icon ?? "barcode",
    kcal: kcal100 && grams ? Math.round((kcal100 * grams) / 100) : guess?.kcal ?? 0,
    type: guess?.pantry ?? "alimento",
    shelfDays: guess?.shelfDays ?? 365,
    catalogId: guess?.id,
  };
}

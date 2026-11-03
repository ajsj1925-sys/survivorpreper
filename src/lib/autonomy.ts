// Autonomía en casa: cuántos días aguantáis en cada recurso con lo que hay en la mochila de casa y en la despensa.
// Las cifras de luz, energía, cocina e higiene son estimaciones orientativas para planificar, no mediciones.
import { CATALOG_BY_ID } from "./catalog";
import { daysUntil, today } from "./calc";
import type { Household, KitItem, PantryLot } from "./types";

export const GOALS = [
  { days: 3, label: "3 días", short: "72 h" },
  { days: 14, label: "2 semanas", short: "2 sem" },
  { days: 30, label: "1 mes", short: "1 mes" },
  { days: 90, label: "3 meses", short: "3 meses" },
] as const;

export type Macro = "proteina" | "hidrato" | "grasa" | "mixto";

/** Datos de «supervivencia» de cada producto del catálogo. */
export const SUPPLY: Record<string, { macro?: Macro; cook?: boolean; lightH?: number; charges?: number; meals?: number; rolls?: number; light?: boolean; renewable?: boolean }> = {
  // Comida: grupo principal y si necesita cocinarse
  racion: { macro: "mixto" }, liofilizado: { macro: "mixto", cook: true }, atun: { macro: "proteina" }, sardinas: { macro: "proteina" },
  garbanzos: { macro: "proteina" }, lentejas: { macro: "proteina" }, fabada: { macro: "proteina" }, "carne-lata": { macro: "proteina" },
  "legumbre-seca": { macro: "proteina", cook: true }, leche: { macro: "proteina" }, "leche-polvo": { macro: "proteina" },
  maiz: { macro: "hidrato" }, melocoton: { macro: "hidrato" }, galletas: { macro: "hidrato" }, "pan-tostado": { macro: "hidrato" },
  miel: { macro: "hidrato" }, arroz: { macro: "hidrato", cook: true }, pasta: { macro: "hidrato", cook: true }, avena: { macro: "hidrato" },
  azucar: { macro: "hidrato" }, tomate: { macro: "hidrato" }, verduras: { macro: "hidrato" },
  aceite: { macro: "grasa" }, "frutos-secos": { macro: "grasa" }, "crema-cacahuete": { macro: "grasa" }, chocolate: { macro: "grasa" },
  barrita: { macro: "mixto" }, "leche-infantil": { macro: "mixto" },
  // Luz y energía (por unidad)
  pilas: { lightH: 30 }, "pilas-aaa": { lightH: 20 }, velas: { lightH: 20 },
  powerbank: { charges: 3 }, solar: { renewable: true },
  linterna: { light: true }, frontal: { light: true }, farol: { light: true },
  "cartucho-gas": { meals: 6 },
  // Higiene
  papel: { rolls: 1 },
};

export interface Stock { id: string; name: string; qty: number; kcal: number; waterL: number; expiresAt: string | null; source: "kit" | "despensa"; lotId?: string }

/** Todo lo que cuenta: la mochila de casa y la despensa, sin lo caducado. */
export function inventory(kit: KitItem[], pantry: PantryLot[], ref: Date = today()): Stock[] {
  const out: Stock[] = [];
  for (const i of kit) {
    if ((i.kitId ?? "main") !== "main" || (i.expiresAt && daysUntil(i.expiresAt, ref) < 0)) continue;
    out.push({ id: i.catalogId ?? i.id, name: i.name, qty: i.qty, kcal: i.kcal, waterL: i.waterL, expiresAt: i.expiresAt, source: "kit" });
  }
  for (const l of pantry) {
    if (daysUntil(l.expiresAt, ref) < 0) continue;
    out.push({ id: l.catalogId ?? l.id, name: l.name, qty: l.qty, kcal: l.kcal ?? 0, waterL: l.waterL ?? 0, expiresAt: l.expiresAt, source: "despensa", lotId: l.id });
  }
  return out;
}

export const qtyOf = (inv: Stock[], ...ids: string[]) => inv.filter((s) => ids.includes(s.id)).reduce((n, s) => n + s.qty, 0);

export interface WaterSources { heaterL: number; bathtub: boolean; cisterns: number }
export const NO_SOURCES: WaterSources = { heaterL: 0, bathtub: false, cisterns: 0 };
export const BATHTUB_L = 150;
export const CISTERN_L = 6;

export function extraWaterL(w: WaterSources = NO_SOURCES) {
  return (w.heaterL || 0) + (w.bathtub ? BATHTUB_L : 0) + (w.cisterns || 0) * CISTERN_L;
}

export type ResourceId = "agua" | "comida" | "luz" | "energia" | "cocina" | "higiene";

export interface Resource {
  id: ResourceId;
  label: string;
  icon: string;
  days: number; // días que aguantáis (Infinity = renovable)
  amount: string; // lo que tenéis, en palabras
  perDay: string; // lo que se gasta al día
  missing: string | null; // qué falta para el objetivo
  warn?: string;
}

const fmt = (n: number, d = 0) => n.toLocaleString("es-ES", { maximumFractionDigits: d });

export function autonomy(kit: KitItem[], pantry: PantryLot[], h: Household, goal: number, sources?: WaterSources) {
  const inv = inventory(kit, pantry);
  const people = Math.max(1, h.adults + h.children);
  const out: Resource[] = [];

  // Agua potable (embotellada): 3 L por persona y día + mascotas
  const water = inv.reduce((s, i) => s + i.waterL * i.qty, 0);
  const waterDay = people * h.waterPerPersonL + h.pets * h.waterPerPetL;
  const wDays = water / waterDay;
  const wNeed = Math.max(0, goal * waterDay - water);
  const extra = extraWaterL(sources);
  out.push({ id: "agua", label: "Agua", icon: "drop", days: wDays, amount: `${fmt(water)} L embotellados`, perDay: `${fmt(waterDay, 1)} L/día`,
    missing: wNeed > 0 ? `${fmt(wNeed)} L (≈ ${Math.ceil(wNeed / 8)} garrafas de 8 L)` : null,
    warn: extra > 0 ? `+${fmt(extra)} L de reserva en casa (termo, bañera, cisternas) para higiene o para potabilizar` : undefined });

  // Comida
  const kcal = inv.reduce((s, i) => s + i.kcal * i.qty * (CATALOG_BY_ID[i.id]?.cat === "mascotas" ? 0 : 1), 0);
  const kcalDay = h.adults * h.kcalAdult + h.children * h.kcalChild;
  const fNeed = Math.max(0, goal * kcalDay - kcal);
  out.push({ id: "comida", label: "Comida", icon: "bowl-food", days: kcal / Math.max(1, kcalDay), amount: `${fmt(kcal)} kcal`, perDay: `${fmt(kcalDay)} kcal/día`,
    missing: fNeed > 0 ? `${fmt(fNeed)} kcal (≈ ${fmt(Math.ceil(fNeed / 3500))} kg de arroz o ${fmt(Math.ceil(fNeed / 480))} botes de legumbre)` : null });

  // Luz: unas 5 horas de luz por noche para toda la casa
  const lightH = inv.reduce((s, i) => s + (SUPPLY[i.id]?.lightH ?? 0) * i.qty, 0);
  const hasLamp = inv.some((i) => SUPPLY[i.id]?.light);
  const lNeed = Math.max(0, goal * 5 - lightH);
  out.push({ id: "luz", label: "Luz", icon: "flashlight", days: hasLamp || lightH ? lightH / 5 : 0, amount: `${fmt(lightH)} h de luz`, perDay: "5 h/noche",
    missing: lNeed > 0 ? `${fmt(lNeed)} h (≈ ${Math.ceil(lNeed / 30)} packs de pilas AA)` : null,
    warn: !hasLamp ? "No tienes linterna, frontal ni farol: sin ellos las pilas no dan luz." : qtyOf(inv, "velas") ? "Las velas provocan incendios: úsalas solo vigiladas." : undefined });

  // Energía: una carga de móvil por adulto y día
  const charges = inv.reduce((s, i) => s + (SUPPLY[i.id]?.charges ?? 0) * i.qty, 0);
  const solar = inv.some((i) => SUPPLY[i.id]?.renewable);
  const cNeed = Math.max(0, goal * h.adults - charges);
  out.push({ id: "energia", label: "Móviles", icon: "battery-charging", days: solar ? Infinity : charges / Math.max(1, h.adults), amount: `${fmt(charges)} cargas${solar ? " + solar" : ""}`,
    perDay: `${h.adults} carga${h.adults === 1 ? "" : "s"}/día`, missing: !solar && cNeed > 0 ? `${fmt(cNeed)} cargas (≈ ${Math.ceil(cNeed / 3)} powerbanks o un cargador solar)` : null });

  // Cocina: una comida caliente al día, si hay hornillo
  const meals = inv.reduce((s, i) => s + (SUPPLY[i.id]?.meals ?? 0) * i.qty, 0);
  const stove = qtyOf(inv, "hornillo") > 0;
  const mNeed = Math.max(0, goal - meals);
  out.push({ id: "cocina", label: "Cocina", icon: "campfire", days: stove ? meals : 0, amount: stove ? `${fmt(meals)} comidas calientes` : "sin hornillo", perDay: "1 comida caliente/día",
    missing: !stove ? "un hornillo de camping y cartuchos" : mNeed > 0 ? `${Math.ceil(mNeed / 6)} cartuchos de gas` : null,
    warn: stove ? "Nunca cocines con gas o carbón en un sitio cerrado: ventila siempre." : undefined });

  // Higiene: papel higiénico, 1 rollo por persona cada 5 días
  const rolls = qtyOf(inv, "papel");
  const rollsDay = people / 5;
  const rNeed = Math.max(0, Math.ceil(goal * rollsDay - rolls));
  out.push({ id: "higiene", label: "Higiene", icon: "toilet-paper", days: rolls / rollsDay, amount: `${fmt(rolls)} rollos`, perDay: `${fmt(rollsDay, 1)} rollos/día`,
    missing: rNeed > 0 ? `${rNeed} rollos de papel` : null });

  const finite = out.filter((r) => Number.isFinite(r.days));
  const weakest = finite.reduce((a, b) => (b.days < a.days ? b : a), finite[0]);
  const core = Math.min(out[0].days, out[1].days); // agua y comida mandan
  const reached = [...GOALS].reverse().find((g) => core >= g.days)?.days ?? 0;
  const next = GOALS.find((g) => g.days > reached)?.days ?? null;
  return { resources: out, weakest, core, reached, next, inv };
}

/** Reparto de calorías por grupo de alimentos. */
export function macroShare(kit: KitItem[], pantry: PantryLot[]) {
  const inv = inventory(kit, pantry);
  const t: Record<Macro, number> = { proteina: 0, hidrato: 0, grasa: 0, mixto: 0 };
  for (const i of inv) {
    const m = SUPPLY[i.id]?.macro;
    if (m) t[m] += i.kcal * i.qty;
  }
  const total = Object.values(t).reduce((a, b) => a + b, 0);
  return { total, share: Object.fromEntries(Object.entries(t).map(([k, v]) => [k, total ? v / total : 0])) as Record<Macro, number> };
}

export function fmtDays(d: number) {
  if (!Number.isFinite(d)) return "∞";
  if (d < 1) return `${Math.round(d * 24)} h`;
  return `${d < 10 ? fmt(d, 1) : fmt(d)} d`;
}

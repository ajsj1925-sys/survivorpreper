import type { Household, KitItem, PantryLot } from "./types";

const DAY_MS = 86_400_000;

/** Fecha local de hoy a medianoche. */
export function today(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Parsea "yyyy-mm-dd" como fecha LOCAL (new Date("2026-01-01") sería UTC y descuadra un día). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** Días que faltan hasta la fecha (negativo = ya caducado). */
export function daysUntil(iso: string, ref: Date = today()): number {
  return Math.round((parseISODate(iso).getTime() - ref.getTime()) / DAY_MS);
}

export type ExpiryLevel = "expired" | "red" | "yellow" | "green";

/** Semáforo: rojo <30 días, amarillo <6 meses, verde >6 meses. */
export function expiryLevel(iso: string, ref: Date = today()): ExpiryLevel {
  const d = daysUntil(iso, ref);
  if (d < 0) return "expired";
  if (d < 30) return "red";
  if (d < 183) return "yellow";
  return "green";
}

export function formatDays(days: number): string {
  if (days < 0) return `Caducó hace ${Math.abs(days)} d`;
  if (days === 0) return "Caduca hoy";
  if (days < 60) return `${days} d`;
  const months = Math.floor(days / 30.4);
  if (months < 24) return `${months} meses`;
  return `${(days / 365).toFixed(1).replace(".", ",")} años`;
}

export function people(h: Household) {
  return h.adults + h.children;
}

export interface KitSummary {
  totalWeightG: number;
  weightPerAdultKg: number;
  totalKcal: number;
  totalWaterL: number;
  dailyKcal: number;
  dailyWaterL: number;
  foodDays: number;
  waterDays: number;
  autonomyHours: number; // limitado por lo que se acabe antes
  limitingFactor: "comida" | "agua" | null;
  expired: KitItem[];
  expiringSoon: KitItem[]; // <30 días
}

export function kitSummary(items: KitItem[], h: Household, ref: Date = today()): KitSummary {
  const totalWeightG = items.reduce((s, i) => s + i.weightG * i.qty, 0);
  const totalKcal = items.reduce((s, i) => s + i.kcal * i.qty, 0);
  const totalWaterL = items.reduce((s, i) => s + i.waterL * i.qty, 0);
  const dailyKcal = h.adults * h.kcalAdult + h.children * h.kcalChild;
  const dailyWaterL = people(h) * h.waterPerPersonL + h.pets * (h.waterPerPetL ?? 0);

  const foodDays = dailyKcal > 0 ? totalKcal / dailyKcal : 0;
  const waterDays = dailyWaterL > 0 ? totalWaterL / dailyWaterL : 0;
  const autonomyDays = Math.min(foodDays, waterDays);

  let limitingFactor: KitSummary["limitingFactor"] = null;
  if (people(h) > 0 && (foodDays > 0 || waterDays > 0)) {
    limitingFactor = waterDays < foodDays ? "agua" : "comida";
  }

  const withDate = items.filter((i) => i.expiresAt);
  const expired = withDate.filter((i) => daysUntil(i.expiresAt!, ref) < 0);
  const expiringSoon = withDate.filter((i) => {
    const d = daysUntil(i.expiresAt!, ref);
    return d >= 0 && d < 30;
  });

  return {
    totalWeightG,
    weightPerAdultKg: h.adults > 0 ? totalWeightG / 1000 / h.adults : totalWeightG / 1000,
    totalKcal,
    totalWaterL,
    dailyKcal,
    dailyWaterL,
    foodDays,
    waterDays,
    autonomyHours: autonomyDays * 24,
    limitingFactor,
    expired,
    expiringSoon,
  };
}

/** Autonomía de TODA la casa: kit + despensa (sin contar lo caducado). */
export function homeSummary(kit: KitItem[], pantry: PantryLot[], h: Household, ref: Date = today()) {
  const k = kitSummary(kit.filter((i) => !i.expiresAt || daysUntil(i.expiresAt, ref) >= 0), h, ref);
  const ok = pantry.filter((l) => daysUntil(l.expiresAt, ref) >= 0);
  const kcal = k.totalKcal + ok.reduce((s, l) => s + (l.kcal ?? 0) * l.qty, 0);
  const water = k.totalWaterL + ok.reduce((s, l) => s + (l.waterL ?? 0) * l.qty, 0);
  const foodDays = k.dailyKcal > 0 ? kcal / k.dailyKcal : 0;
  const waterDays = k.dailyWaterL > 0 ? water / k.dailyWaterL : 0;
  return { kcal, water, foodDays, waterDays, days: Math.min(foodDays, waterDays), limiting: waterDays < foodDays ? "agua" : "comida" };
}

/** % de vida útil que le queda a un lote (100 = recién comprado, 0 = caducado). */
export function lifePct(addedAt: string, expiresAt: string, ref: Date = today()): number {
  const start = new Date(addedAt);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const total = (parseISODate(expiresAt).getTime() - startDay.getTime()) / DAY_MS;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, (daysUntil(expiresAt, ref) / total) * 100));
}

export function pantryCounts(lots: PantryLot[], ref: Date = today()) {
  const c = { expired: 0, red: 0, yellow: 0, green: 0 };
  for (const l of lots) c[expiryLevel(l.expiresAt, ref)]++;
  return c;
}

export function fmtNumber(n: number, decimals = 0) {
  return n.toLocaleString("es-ES", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

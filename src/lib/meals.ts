// Menú de emergencia y recetas con lo que hay en casa.
import { CATALOG_BY_ID } from "./catalog";
import { daysUntil } from "./calc";
import { SUPPLY, inventory, qtyOf, type Stock } from "./autonomy";
import type { Household, KitItem, PantryLot } from "./types";

export interface Recipe { name: string; uses: string[]; cook: boolean; how: string }

export const RECIPES: Recipe[] = [
  { name: "Ensalada de garbanzos con atún", uses: ["garbanzos", "atun", "maiz"], cook: false, how: "Escurre los garbanzos y el maíz, mezcla con el atún y un chorro de aceite." },
  { name: "Ensalada de lentejas", uses: ["lentejas", "verduras", "aceite"], cook: false, how: "Lentejas de bote escurridas con verduras en conserva, aceite y sal." },
  { name: "Arroz con atún y tomate", uses: ["arroz", "atun", "tomate"], cook: true, how: "Hierve el arroz 15 min, escurre y mezcla con el tomate y el atún." },
  { name: "Pasta con tomate y sardinas", uses: ["pasta", "tomate", "sardinas"], cook: true, how: "Cuece la pasta, añade el tomate y las sardinas desmenuzadas." },
  { name: "Lentejas secas con arroz", uses: ["legumbre-seca", "arroz"], cook: true, how: "Remoja la legumbre la noche anterior y cuécela con el arroz. Mucha energía y proteína." },
  { name: "Gachas de avena con miel", uses: ["avena", "leche-polvo", "miel"], cook: false, how: "Avena con leche en polvo y agua, en remojo 10 min (o toda la noche). Endulza con miel." },
  { name: "Tostadas con crema de cacahuete", uses: ["pan-tostado", "crema-cacahuete", "miel"], cook: false, how: "Desayuno rápido y muy calórico, sin cocinar." },
  { name: "Sardinas con pan tostado", uses: ["sardinas", "pan-tostado"], cook: false, how: "Proteína y grasa buena sin encender nada." },
  { name: "Fabada o carne en conserva caliente", uses: ["fabada", "carne-lata"], cook: true, how: "Calienta la lata en un cazo (nunca la lata cerrada al fuego)." },
  { name: "Postre: fruta en almíbar con galletas", uses: ["melocoton", "galletas"], cook: false, how: "Un poco de azúcar levanta el ánimo en días difíciles." },
  { name: "Leche con galletas", uses: ["leche", "galletas"], cook: false, how: "Desayuno de toda la vida, sin nevera." },
];

/** Recetas para gastar lo que caduca pronto (ordenadas por urgencia y por lo que ya tienes). */
export function recipesFor(kit: KitItem[], pantry: PantryLot[], canCook: boolean) {
  const inv = inventory(kit, pantry);
  const soon = new Map<string, number>();
  for (const s of inv) if (s.expiresAt && s.source === "despensa") soon.set(s.id, Math.min(soon.get(s.id) ?? 9999, daysUntil(s.expiresAt)));
  return RECIPES.map((r) => {
    const have = r.uses.filter((u) => qtyOf(inv, u) > 0);
    const urgency = Math.min(...r.uses.map((u) => soon.get(u) ?? 9999));
    return { ...r, have, missing: r.uses.filter((u) => !have.includes(u)).map((u) => CATALOG_BY_ID[u]?.name ?? u), urgency };
  })
    .filter((r) => r.have.length >= Math.min(2, r.uses.length) && (canCook || !r.cook))
    .sort((a, b) => a.urgency - b.urgency || b.have.length - a.have.length);
}

const BREAKFAST = ["galletas", "pan-tostado", "avena", "leche", "leche-polvo", "miel", "crema-cacahuete", "chocolate", "barrita", "melocoton", "azucar"];

export interface MenuItem { id: string; name: string; units: number; unit: string; cook: boolean }
export interface MenuDay { day: number; breakfast: MenuItem[]; main: MenuItem[]; kcal: number }

/**
 * Reparte la comida por días: primero lo que caduca antes (rotación), hasta cubrir las calorías de cada día.
 * Sin hornillo (o eligiendo «sin cocinar») solo usa lo que se come tal cual.
 */
export function emergencyMenu(kit: KitItem[], pantry: PantryLot[], h: Household, opts: { noCook: boolean; maxDays?: number }) {
  const inv = inventory(kit, pantry);
  const stove = qtyOf(inv, "hornillo") > 0 && qtyOf(inv, "cartucho-gas") > 0;
  const cookOk = !opts.noCook && stove;
  const kcalDay = h.adults * h.kcalAdult + h.children * h.kcalChild;
  type Pool = Stock & { left: number; unit: string; cook: boolean };
  const pool: Pool[] = inv
    .filter((s) => s.kcal > 0 && CATALOG_BY_ID[s.id]?.cat !== "mascotas" && s.id !== "leche-infantil")
    .map((s) => ({ ...s, left: s.qty, unit: CATALOG_BY_ID[s.id]?.unit ?? "ud", cook: !!SUPPLY[s.id]?.cook }))
    .filter((s) => cookOk || !s.cook)
    .sort((a, b) => (a.expiresAt ?? "9999").localeCompare(b.expiresAt ?? "9999"));
  const skipped = inv.filter((s) => s.kcal > 0 && SUPPLY[s.id]?.cook && !cookOk);
  const days: MenuDay[] = [];
  const firstOut: { name: string; day: number }[] = [];
  const maxDays = opts.maxDays ?? 120;
  for (let d = 1; d <= maxDays; d++) {
    let need = kcalDay;
    const day: MenuDay = { day: d, breakfast: [], main: [], kcal: 0 };
    // primero un desayuno (≈ 25 % del día), luego el resto
    for (const phase of ["breakfast", "main"] as const) {
      let target = phase === "breakfast" ? kcalDay * 0.25 : need;
      for (const p of pool) {
        if (target <= 1) break;
        if (p.left <= 0) continue;
        if (phase === "breakfast" && !BREAKFAST.includes(p.id)) continue;
        const units = Math.min(p.left, target / p.kcal);
        const rounded = Math.max(0.05, Math.round(units * 20) / 20);
        const use = Math.min(p.left, rounded);
        p.left -= use;
        const k = use * p.kcal;
        target -= k; need -= k; day.kcal += k;
        day[phase].push({ id: p.id, name: p.name, units: use, unit: p.unit, cook: p.cook });
        if (p.left <= 0.001) firstOut.push({ name: p.name, day: d });
      }
    }
    if (day.kcal < kcalDay * 0.5) break; // ya no hay comida para un día razonable
    days.push(day);
  }
  return { days, firstOut, cookOk, stove, skipped: [...new Set(skipped.map((s) => s.name))], kcalDay };
}

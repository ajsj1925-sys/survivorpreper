import { CATALOG_BY_ID } from "./catalog";
import type { Household, KitItem } from "./types";

// Lo imprescindible de un kit de 72 h, en línea con las recomendaciones habituales de protección civil.
export interface Essential {
  id: string;
  label: string;
  emoji: string;
  hint: string;
  catalogIds: string[]; // cualquiera de estos en el kit lo cubre
  amazonQuery: string;
  onlyIf?: (h: Household) => boolean;
}

export const ESSENTIALS: Essential[] = [
  { id: "agua", hint: "3 litros por persona y día", label: "Agua", emoji: "💧", catalogIds: ["agua-15", "agua-5", "agua-05"], amazonQuery: "agua emergencia larga duración" },
  { id: "comida", hint: "latas, barritas y raciones que no necesiten cocinarse", label: "Comida", emoji: "🥫", catalogIds: ["racion", "liofilizado", "atun", "sardinas", "garbanzos", "lentejas", "fabada", "barrita", "frutos-secos", "galletas"], amazonQuery: "raciones de emergencia larga duración" },
  { id: "radio", hint: "a pilas o dinamo, para recibir avisos si cae la red", label: "Radio", emoji: "📻", catalogIds: ["radio"], amazonQuery: "radio dinamo emergencia" },
  { id: "linterna", hint: "mejor frontal, con pilas de repuesto", label: "Linterna", emoji: "🔦", catalogIds: ["linterna", "frontal"], amazonQuery: "linterna frontal led" },
  { id: "pilas", hint: "pilas y powerbank cargado; revísalos cada 6 meses", label: "Pilas", emoji: "🔋", catalogIds: ["pilas", "powerbank", "solar"], amazonQuery: "powerbank solar" },
  { id: "botiquin", hint: "gasas, antiséptico, vendas y analgésicos", label: "Botiquín", emoji: "🩹", catalogIds: ["botiquin"], amazonQuery: "botiquín primeros auxilios" },
  { id: "medicacion", hint: "la medicación personal para al menos 7 días", label: "Medicinas", emoji: "💊", catalogIds: ["medicacion", "paracetamol", "ibuprofeno"], amazonQuery: "pastillero semanal" },
  { id: "efectivo", hint: "billetes pequeños: sin luz no hay datáfono", label: "Efectivo", emoji: "💶", catalogIds: ["efectivo"], amazonQuery: "cartera impermeable" },
  { id: "documentos", hint: "copia del DNI, seguros y recetas en bolsa estanca", label: "Papeles", emoji: "📄", catalogIds: ["documentos"], amazonQuery: "funda impermeable documentos" },
  { id: "fuego", hint: "mechero o cerillas en bolsa estanca", label: "Mechero", emoji: "🔥", catalogIds: ["mechero"], amazonQuery: "cerillas impermeables" },
  { id: "navaja", hint: "una navaja multiusos", label: "Navaja", emoji: "🔪", catalogIds: ["navaja"], amazonQuery: "navaja multiusos" },
  { id: "manta", hint: "manta térmica y ropa de abrigo, una por persona", label: "Abrigo", emoji: "🥇", catalogIds: ["manta", "saco", "chaqueta"], amazonQuery: "manta térmica emergencia" },
  { id: "silbato", hint: "para pedir ayuda sin gastar la voz", label: "Silbato", emoji: "📢", catalogIds: ["silbato"], amazonQuery: "silbato emergencia" },
  { id: "higiene", hint: "papel, gel, toallitas y bolsas de basura", label: "Higiene", emoji: "🧻", catalogIds: ["papel", "jabon", "toallitas", "bolsas-basura"], amazonQuery: "kit higiene viaje" },
  { id: "mascota", hint: "comida y agua extra para tu mascota", label: "Mascota", emoji: "🐾", catalogIds: ["pienso"], amazonQuery: "pienso perro", onlyIf: (h) => h.pets > 0 },
];

export function activeEssentials(h: Household) {
  return ESSENTIALS.filter((e) => !e.onlyIf || e.onlyIf(h));
}

export function essentialCovered(e: Essential, kit: KitItem[], checked: string[]): boolean {
  if (checked.includes(e.id)) return true;
  return kit.some((i) => i.qty > 0 && i.catalogId && e.catalogIds.includes(i.catalogId)) ||
    kit.some((i) => e.catalogIds.some((c) => CATALOG_BY_ID[c] && i.name.toLowerCase() === CATALOG_BY_ID[c].name.toLowerCase()));
}

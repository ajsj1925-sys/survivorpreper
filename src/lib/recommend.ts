import { CATALOG_BY_ID, type CatalogItem } from "./catalog";
import type { Household, KitItem } from "./types";

export interface RecLine {
  item: CatalogItem;
  target: number;
  have: number;
}

/** Kit recomendado de 72 h para ESTE hogar (personas, niños y mascotas). */
export function recommendedKit(h: Household): { id: string; target: number }[] {
  const people = Math.max(1, h.adults + h.children);
  const days = 3;
  const waterL = (people * h.waterPerPersonL + h.pets * h.waterPerPetL) * days;
  const kcal = (h.adults * h.kcalAdult + h.children * h.kcalChild) * days;

  const lines: { id: string; target: number }[] = [
    { id: "agua-15", target: Math.ceil(waterL / 1.5) },
    // Mezcla sin cocinar: 60 % raciones, 25 % latas de atún, 15 % barritas
    { id: "racion", target: Math.ceil((kcal * 0.6) / 2400) },
    { id: "atun", target: Math.ceil((kcal * 0.25) / 190) },
    { id: "barrita", target: Math.ceil((kcal * 0.15) / 220) },
    { id: "abrelatas", target: 1 },
    { id: "radio", target: 1 },
    { id: "frontal", target: Math.max(1, h.adults) },
    { id: "pilas", target: 2 },
    { id: "powerbank", target: 1 },
    { id: "botiquin", target: 1 },
    { id: "medicacion", target: 1 },
    { id: "potabilizadoras", target: 1 },
    { id: "efectivo", target: 1 },
    { id: "documentos", target: 1 },
    { id: "mechero", target: 1 },
    { id: "navaja", target: 1 },
    { id: "manta", target: people },
    { id: "silbato", target: people },
    { id: "papel", target: 2 },
    { id: "toallitas", target: 1 },
    { id: "bolsas-basura", target: 1 },
    { id: "mascarillas", target: 1 },
  ];
  if (h.children > 0) lines.push({ id: "panales", target: 1 });
  if (h.pets > 0) lines.push({ id: "pienso", target: 1 }, { id: "correa", target: h.pets });
  return lines;
}

export function recommendationStatus(h: Household, kit: KitItem[]): RecLine[] {
  return recommendedKit(h).map(({ id, target }) => ({
    item: CATALOG_BY_ID[id],
    target,
    have: kit.filter((k) => k.catalogId === id).reduce((s, k) => s + k.qty, 0),
  }));
}

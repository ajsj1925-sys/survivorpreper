// Escenarios: qué hace falta para cada situación y si ya lo tienes (calculado o marcado a mano).
import { autonomy, extraWaterL, qtyOf, type WaterSources } from "./autonomy";
import type { FamilyPlan, Household, KitItem, PantryLot } from "./types";

export interface ScenarioCheck { id: string; label: string; ok: boolean; detail?: string; manual?: boolean }
export interface Scenario { id: string; title: string; icon: string; intro: string; checks: ScenarioCheck[] }

export function scenarios(kit: KitItem[], pantry: PantryLot[], h: Household, plan: FamilyPlan, sources: WaterSources, manual: string[]): Scenario[] {
  const days = (goal: number) => autonomy(kit, pantry, h, goal, sources);
  const a = days(3);
  const r = Object.fromEntries(a.resources.map((x) => [x.id, x]));
  const inv = a.inv;
  const has = (...ids: string[]) => qtyOf(inv, ...ids) > 0;
  const m = (id: string, label: string, detail?: string): ScenarioCheck => ({ id, label, ok: manual.includes(id), detail, manual: true });
  const d = (n: number) => `${n < 10 ? n.toFixed(1).replace(".", ",") : Math.round(n)} días`;
  const people = h.adults + h.children;

  return [
    { id: "apagon", title: "Apagón de 3 días", icon: "lightning", intro: "Sin luz, sin datáfonos y quizá sin cobertura ni agua en los pisos altos.",
      checks: [
        { id: "agua3", label: "Agua para 3 días", ok: r.agua.days >= 3, detail: `Tenéis para ${d(r.agua.days)}` },
        { id: "comida3", label: "Comida sin cocinar para 3 días", ok: r.comida.days >= 3, detail: `Tenéis para ${d(r.comida.days)}` },
        { id: "luz", label: "Linterna o frontal con pilas", ok: has("linterna", "frontal", "farol") && has("pilas", "pilas-aaa") },
        { id: "radio", label: "Radio a pilas o dinamo", ok: has("radio") },
        { id: "power", label: "Powerbank cargado", ok: has("powerbank", "solar") },
        { id: "efectivo", label: "Dinero en efectivo", ok: has("efectivo") },
        m("m-nevera", "Sabéis qué hacer con la nevera (no abrirla; a las 4 h, revisar)"),
        m("m-ascensor", "Nadie depende de ascensor o de aparatos médicos eléctricos (o tenéis plan)"),
      ] },
    { id: "confinamiento", title: "Confinamiento de 2 semanas", icon: "house-line", intro: "No se puede salir: ni compras ni farmacia durante 14 días.",
      checks: [
        { id: "agua14", label: "Agua para 14 días", ok: r.agua.days >= 14, detail: `Tenéis para ${d(r.agua.days)}` },
        { id: "comida14", label: "Comida para 14 días", ok: r.comida.days >= 14, detail: `Tenéis para ${d(r.comida.days)}` },
        { id: "higiene14", label: "Papel higiénico para 14 días", ok: r.higiene.days >= 14, detail: `Tenéis para ${d(r.higiene.days)}` },
        { id: "botiquin", label: "Botiquín y analgésicos", ok: has("botiquin") && has("paracetamol", "ibuprofeno") },
        { id: "jabon", label: "Jabón y bolsas de basura", ok: has("jabon") && has("bolsas-basura") },
        m("m-medicacion", "Medicación crónica para al menos 2 semanas"),
        ...(h.pets ? [{ id: "pienso", label: "Comida para la mascota", ok: has("pienso") }] : []),
        ...(h.children ? [m("m-ninos", "Cosas para los niños: pañales, leche, entretenimiento")] : []),
      ] },
    { id: "agua", title: "Corte de agua", icon: "drop-slash", intro: "Sale poco o nada del grifo: hay que beber, cocinar, asearse y usar el váter.",
      checks: [
        { id: "beber", label: "Agua de beber para 3 días", ok: r.agua.days >= 3, detail: `${people} personas × 3 L × 3 días` },
        { id: "reserva", label: "Agua extra para higiene y cisterna", ok: extraWaterL(sources) >= 20 * people, detail: extraWaterL(sources) ? `Tenéis ${Math.round(extraWaterL(sources))} L de reserva` : "Apunta el termo o la bañera en Agua" },
        { id: "potabilizar", label: "Forma de potabilizar (lejía apta, pastillas o filtro)", ok: has("lejia-agua", "potabilizadoras", "filtro-agua") },
        { id: "toallitas", label: "Toallitas y gel", ok: has("toallitas") && has("jabon") },
        { id: "bolsas", label: "Bolsas de basura (para el váter si no hay cisterna)", ok: has("bolsas-basura") },
        m("m-llave", "Sabéis dónde está la llave de paso del agua"),
      ] },
    { id: "evacuacion", title: "Evacuación con mochila", icon: "person-simple-walk", intro: "Hay que salir de casa en minutos y quizá no volver en días.",
      checks: [
        { id: "docs", label: "Copia de documentos en funda estanca", ok: has("documentos") },
        { id: "dinero", label: "Dinero en efectivo", ok: has("efectivo") },
        { id: "botiquin-ev", label: "Botiquín y medicación", ok: has("botiquin") && has("medicacion") },
        { id: "luz-ev", label: "Linterna o frontal", ok: has("linterna", "frontal") },
        { id: "agua-ev", label: "Agua y comida para el primer día", ok: r.agua.days >= 1 && r.comida.days >= 1 },
        { id: "abrigo", label: "Manta térmica o abrigo", ok: has("manta", "chaqueta", "poncho") },
        { id: "plan", label: "Punto de encuentro acordado", ok: !!plan.meetingPointFar || !!plan.meetingPointNear },
        m("m-mochila", "La mochila está hecha y en un sitio a mano (y pesa menos de 10 kg por adulto)"),
      ] },
  ];
}

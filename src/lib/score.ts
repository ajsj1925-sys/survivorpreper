import { daysUntil, homeSummary, kitSummary } from "./calc";
import { activeEssentials, essentialCovered } from "./essentials";
import type { FamilyPlan, Household, KitItem, PantryLot } from "./types";

export interface ScorePart {
  id: string;
  icon: string;
  label: string;
  points: number;
  max: number;
  tip: string;
  href: string;
}

/** Nota de preparación 0–100: engancha a mejorar y se comparte. */
export function readiness(kit: KitItem[], pantry: PantryLot[], plan: FamilyPlan, h: Household, checked: string[]) {
  const k = kitSummary(kit, h);
  const home = homeSummary(kit, pantry, h);
  const ess = activeEssentials(h);
  const covered = ess.filter((e) => essentialCovered(e, kit, checked));
  const missing = ess.filter((e) => !covered.includes(e));
  const expired = kit.filter((i) => i.expiresAt && daysUntil(i.expiresAt) < 0).length +
    pantry.filter((l) => daysUntil(l.expiresAt) < 0).length;
  const planChecks = [
    plan.meetingPointNear,
    plan.meetingPointFar,
    plan.outOfAreaContact,
    plan.docsLocation,
    plan.members.length > 0 ? "x" : "",
  ];
  const planDone = planChecks.filter(Boolean).length;

  const parts: ScorePart[] = [
    {
      id: "kit", icon: "backpack", label: "Kit 72 h", max: 30,
      points: Math.round(Math.min(1, k.autonomyHours / 72) * 30),
      tip: k.autonomyHours >= 72 ? "Kit completo" : `Te faltan ${Math.ceil(72 - k.autonomyHours)} h de ${k.limitingFactor ?? "comida y agua"}`,
      href: "/app/kit",
    },
    {
      id: "esenciales", icon: "seal-check", label: "Esenciales", max: 30,
      points: Math.round((covered.length / ess.length) * 30),
      tip: missing.length ? `Falta: ${missing.slice(0, 3).map((e) => e.label.toLowerCase()).join(", ")}${missing.length > 3 ? "…" : ""}` : "Todo cubierto",
      href: "/app/kit",
    },
    {
      id: "despensa", icon: "house", label: "Reservas en casa", max: 15,
      points: Math.round(Math.min(1, home.days / 7) * 15),
      tip: home.days >= 7 ? "Una semana cubierta" : `Aguantáis ${home.days.toFixed(1).replace(".", ",")} días; objetivo 7`,
      href: "/app/despensa",
    },
    {
      id: "caducados", icon: "calendar-check", label: "Sin caducados", max: 10,
      points: Math.max(0, 10 - expired * 3),
      tip: expired ? `${expired} producto${expired > 1 ? "s" : ""} caducado${expired > 1 ? "s" : ""}` : "Todo en fecha",
      href: "/app/despensa",
    },
    {
      id: "plan", icon: "users-three", label: "Plan familiar", max: 15,
      points: Math.round((planDone / planChecks.length) * 15),
      tip: planDone === planChecks.length ? "Plan listo" : `${planChecks.length - planDone} apartado${planChecks.length - planDone > 1 ? "s" : ""} sin rellenar`,
      href: "/app/plan",
    },
  ];
  const total = parts.reduce((s, p) => s + p.points, 0);
  const next = [...parts].sort((a, b) => b.max - b.points - (a.max - a.points))[0];
  return { total, parts, next };
}

export function scoreLabel(n: number) {
  if (n >= 85) return { text: "Muy preparados", tone: "text-emerald-600", stroke: "#059669" };
  if (n >= 60) return { text: "Bien encaminados", tone: "text-lime-600", stroke: "#65a30d" };
  if (n >= 35) return { text: "A medias", tone: "text-amber-600", stroke: "#d97706" };
  return { text: "Poco preparados", tone: "text-red-600", stroke: "#dc2626" };
}

export function clampScore(raw: string) {
  const n = Math.round(Number(raw));
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}

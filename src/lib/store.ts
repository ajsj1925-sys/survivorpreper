"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { DEFAULTS } from "./config";
import { CATALOG_BY_ID, type CatalogItem } from "./catalog";
import { addDays, parseISODate, toISODate, today } from "./calc";
import type { FamilyMember, FamilyPlan, Household, Kit, KitItem, PantryLot } from "./types";

export const MAIN_KIT = "main";
export const FREE_KITS = 2; // más mochilas = Pro
export type Theme = "system" | "light" | "dark";

export function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const emptyPlan: FamilyPlan = {
  householdName: "",
  address: "",
  meetingPointNear: "",
  meetingPointFar: "",
  outOfAreaContact: "",
  docsLocation: "",
  utilitiesShutoff: "",
  notes: "",
  members: [],
};

export interface BackupData {
  household: Household;
  kits?: Kit[];
  kit: KitItem[];
  pantry: PantryLot[];
  plan: FamilyPlan;
  checkedEssentials: string[];
}

interface AppState {
  household: Household;
  kits: Kit[];
  activeKitId: string;
  theme: Theme;
  lastReminder: string | null; // fecha del último aviso de caducidad mostrado
  kit: KitItem[];
  checkedEssentials: string[];
  pantry: PantryLot[];
  plan: FamilyPlan;
  email: string | null;
  isPro: boolean;

  setHousehold: (patch: Partial<Household>) => void;
  completeOnboarding: (patch: Partial<Household>) => void;

  addKit: (name: string, icon: string) => string;
  removeKit: (id: string) => void;
  setActiveKit: (id: string) => void;
  setTheme: (t: Theme) => void;
  markReminded: (isoDate: string) => void;
  addKitItem: (item: Omit<KitItem, "id" | "kitId">) => void;
  updateKitItem: (id: string, patch: Partial<KitItem>) => void;
  removeKitItem: (id: string) => void;
  toggleEssential: (id: string) => void;
  addFromCatalog: (c: CatalogItem, n?: number) => void;
  decFromCatalog: (catalogId: string) => void;
  setCatalogQty: (c: CatalogItem, qty: number) => void;

  addPantryLot: (lot: Omit<PantryLot, "id" | "addedAt">) => void;
  removePantryLot: (id: string) => void;
  consumeLot: (id: string) => void;
  restockLot: (id: string) => void;

  setPlan: (patch: Partial<Omit<FamilyPlan, "members">>) => void;
  addMember: () => void;
  updateMember: (id: string, patch: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;

  setEmail: (email: string) => void;
  importData: (data: BackupData) => void;
  resetAll: () => void;
}

const initial = {
  household: {
    adults: 1,
    children: 0,
    pets: 0,
    kcalAdult: DEFAULTS.kcalAdult,
    kcalChild: DEFAULTS.kcalChild,
    waterPerPersonL: DEFAULTS.waterPerPersonL,
    waterPerPetL: 1,
    onboarded: false,
  },
  kits: [{ id: MAIN_KIT, name: "Casa", icon: "house" }] as Kit[],
  activeKitId: MAIN_KIT,
  theme: "system" as Theme,
  lastReminder: null as string | null,
  kit: [] as KitItem[],
  checkedEssentials: [] as string[],
  pantry: [] as PantryLot[],
  plan: emptyPlan,
  email: null as string | null,
  isPro: false,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initial,

      setHousehold: (patch) => set((s) => ({ household: { ...s.household, ...patch } })),
      completeOnboarding: (patch) => set((s) => ({ household: { ...s.household, ...patch, onboarded: true } })),

      addKit: (name, icon) => {
        const id = uid();
        set((s) => ({ kits: [...s.kits, { id, name, icon }], activeKitId: id }));
        return id;
      },
      removeKit: (id) =>
        set((s) =>
          id === MAIN_KIT
            ? {}
            : { kits: s.kits.filter((k) => k.id !== id), kit: s.kit.filter((i) => i.kitId !== id), activeKitId: MAIN_KIT },
        ),
      setActiveKit: (id) => set({ activeKitId: id }),
      setTheme: (theme) => set({ theme }),
      markReminded: (lastReminder) => set({ lastReminder }),

      addKitItem: (item) => set((s) => ({ kit: [...s.kit, { ...item, id: uid(), kitId: s.activeKitId }] })),
      updateKitItem: (id, patch) =>
        set((s) => ({ kit: s.kit.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      removeKitItem: (id) => set((s) => ({ kit: s.kit.filter((i) => i.id !== id) })),
      toggleEssential: (id) =>
        set((s) => ({
          checkedEssentials: s.checkedEssentials.includes(id)
            ? s.checkedEssentials.filter((e) => e !== id)
            : [...s.checkedEssentials, id],
        })),

      addFromCatalog: (c, n = 1) =>
        set((s) => {
          const ex = s.kit.find((i) => i.catalogId === c.id && i.kitId === s.activeKitId);
          if (ex) return { kit: s.kit.map((i) => (i === ex ? { ...i, qty: i.qty + n } : i)) };
          return { kit: [...s.kit, kitFromCatalog(c, n, s.activeKitId)] };
        }),
      decFromCatalog: (catalogId) =>
        set((s) => ({
          kit: s.kit
            .map((i) => (i.catalogId === catalogId && i.kitId === s.activeKitId ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),
      setCatalogQty: (c, qty) =>
        set((s) => {
          const mine = (i: KitItem) => i.catalogId === c.id && i.kitId === s.activeKitId;
          const ex = s.kit.find(mine);
          if (qty <= 0) return { kit: s.kit.filter((i) => !mine(i)) };
          if (ex) return { kit: s.kit.map((i) => (i === ex ? { ...i, qty } : i)) };
          return { kit: [...s.kit, kitFromCatalog(c, qty, s.activeKitId)] };
        }),

      addPantryLot: (lot) =>
        set((s) => ({
          pantry: [...s.pantry, { ...lot, id: uid(), addedAt: new Date().toISOString() }],
        })),
      removePantryLot: (id) => set((s) => ({ pantry: s.pantry.filter((l) => l.id !== id) })),
      consumeLot: (id) =>
        set((s) => ({
          pantry: s.pantry.map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0),
        })),
      restockLot: (id) =>
        set((s) => ({
          pantry: s.pantry.map((l) => {
            if (l.id !== id) return l;
            // Nueva caducidad: la vida típica del catálogo o, si no hay, la misma duración que tenía el lote
            const shelf = l.catalogId ? CATALOG_BY_ID[l.catalogId]?.shelfDays : null;
            const span = Math.max(30, Math.round((parseISODate(l.expiresAt).getTime() - new Date(l.addedAt).getTime()) / 864e5));
            return { ...l, addedAt: new Date().toISOString(), expiresAt: toISODate(addDays(today(), shelf ?? span)) };
          }),
        })),

      setPlan: (patch) => set((s) => ({ plan: { ...s.plan, ...patch } })),
      addMember: () =>
        set((s) => ({
          plan: {
            ...s.plan,
            members: [...s.plan.members, { id: uid(), name: "", phone: "", notes: "" }],
          },
        })),
      updateMember: (id, patch) =>
        set((s) => ({
          plan: {
            ...s.plan,
            members: s.plan.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
          },
        })),
      removeMember: (id) =>
        set((s) => ({
          plan: { ...s.plan, members: s.plan.members.filter((m) => m.id !== id) },
        })),

      setEmail: (email) => set({ email }),
      importData: (d) =>
        set({
          household: { ...initial.household, ...d.household, onboarded: true },
          kits: d.kits?.length ? d.kits : initial.kits,
          activeKitId: MAIN_KIT,
          kit: (d.kit ?? []).map((i) => ({ ...i, kitId: i.kitId ?? MAIN_KIT })),
          pantry: d.pantry ?? [],
          plan: { ...emptyPlan, ...d.plan },
          checkedEssentials: d.checkedEssentials ?? [],
        }),
      resetAll: () => set({ ...initial }),
    }),
    {
      name: "survivoros-v1",
      version: 4,
      migrate: (persisted, version) => {
        const p = persisted as Partial<AppState>;
        if (version < 2) {
          p.household = { ...initial.household, ...p.household, waterPerPetL: 1, onboarded: (p.kit?.length ?? 0) > 0 };
          p.pantry = (p.pantry ?? []).map((l) => ({ ...l, kcal: l.kcal ?? 0, waterL: l.waterL ?? 0 }));
        }
        if (version < 3) {
          // v3: de emojis a iconos Phosphor
          const iconOf = (id?: string) => (id ? CATALOG_BY_ID[id]?.icon : undefined);
          p.kit = (p.kit ?? []).map(({ emoji: _e, ...i }: KitItem & { emoji?: string }) => ({ ...i, icon: iconOf(i.catalogId) }));
          p.pantry = (p.pantry ?? []).map(({ emoji: _e, ...l }: PantryLot & { emoji?: string }) => ({ ...l, icon: iconOf(l.catalogId) }));
        }
        if (version < 4) {
          // v4: varias mochilas; todo lo anterior va a "Casa"
          p.kits = initial.kits;
          p.activeKitId = MAIN_KIT;
          p.kit = (p.kit ?? []).map((i) => ({ ...i, kitId: i.kitId ?? MAIN_KIT }));
        }
        return p as AppState;
      },
      storage: createJSONStorage(() => localStorage),
      // isPro NO se persiste desde el cliente: en Fase 2 vendrá verificado del servidor.
      partialize: ({ isPro: _isPro, ...rest }) => rest,
    },
  ),
);

export function kitFromCatalog(c: CatalogItem, qty: number, kitId: string = MAIN_KIT): KitItem {
  return {
    id: uid(),
    kitId,
    catalogId: c.id,
    icon: c.icon,
    name: c.name,
    category: c.cat,
    qty,
    weightG: c.weightG,
    kcal: c.kcal,
    waterL: c.waterL,
    expiresAt: c.shelfDays ? toISODate(addDays(today(), c.shelfDays)) : null,
  };
}

/** Estado de interfaz (no persistido): modal de pago. */
interface UIState {
  paywallFeature: string | null;
  openPaywall: (feature: string) => void;
  closePaywall: () => void;
}

export const useUI = create<UIState>()((set) => ({
  paywallFeature: null,
  openPaywall: (feature) => set({ paywallFeature: feature }),
  closePaywall: () => set({ paywallFeature: null }),
}));

/** Lo que hay en la mochila de casa: es la que cuenta para la nota, Inicio y la compra. */
export const mainKitItems = (kit: KitItem[]) => kit.filter((i) => (i.kitId ?? MAIN_KIT) === MAIN_KIT);

/** Evita desajustes de hidratación: el servidor no conoce el localStorage. */
export function useHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return ok;
}

export type KitCategory =
  | "agua"
  | "comida"
  | "botiquin"
  | "luz-energia"
  | "comunicacion"
  | "herramientas"
  | "abrigo"
  | "documentos"
  | "higiene"
  | "mascotas"
  | "otro";

export interface Kit {
  id: string; // "main" = la mochila de casa (cuenta para la nota)
  name: string;
  icon: string;
}

export interface KitItem {
  id: string;
  kitId: string; // a qué mochila pertenece
  catalogId?: string;
  icon?: string; // icono Phosphor
  name: string;
  category: KitCategory;
  qty: number;
  weightG: number; // por unidad
  kcal: number; // por unidad (solo alimentación humana)
  waterL: number; // litros de agua potable por unidad
  expiresAt: string | null; // ISO yyyy-mm-dd; se guarda la FECHA, no "días hasta"
}

export type PantryType = "alimento" | "medicina" | "agua" | "higiene" | "otro";

export interface PantryLot {
  id: string;
  catalogId?: string;
  barcode?: string;
  icon?: string; // icono Phosphor
  name: string;
  type: PantryType;
  qty: number;
  unit: string;
  kcal: number; // por unidad
  waterL: number; // por unidad
  expiresAt: string; // ISO yyyy-mm-dd
  location: string;
  addedAt: string; // ISO; sirve para la barra de vida útil
}

export interface Household {
  adults: number;
  children: number;
  pets: number;
  kcalAdult: number;
  kcalChild: number;
  waterPerPersonL: number;
  waterPerPetL: number;
  onboarded: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  notes: string; // medicación, alergias, necesidades
}

export interface FamilyPlan {
  householdName: string;
  address: string;
  meetingPointNear: string;
  meetingPointFar: string;
  outOfAreaContact: string;
  docsLocation: string;
  utilitiesShutoff: string;
  notes: string;
  members: FamilyMember[];
}

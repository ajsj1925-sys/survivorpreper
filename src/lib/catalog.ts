import type { KitCategory, PantryType } from "./types";

// Catálogo con valores MEDIOS orientativos por unidad. El usuario solo toca; los números ya vienen.
export interface CatalogItem {
  id: string;
  name: string;
  icon: string; // icono Phosphor (duotono)
  cat: KitCategory;
  kcal: number;
  weightG: number;
  waterL: number;
  shelfDays: number | null; // vida útil típica; null = no caduca
  unit: string;
  pantry?: PantryType; // si tiene sentido en la despensa
  aliases?: string[];
}

const C = (
  id: string,
  name: string,
  icon: string,
  cat: KitCategory,
  kcal: number,
  weightG: number,
  waterL: number,
  shelfDays: number | null,
  unit = "ud",
  pantry?: PantryType,
  aliases: string[] = [],
): CatalogItem => ({ id, name, icon, cat, kcal, weightG, waterL, shelfDays, unit, pantry, aliases });

export const CATALOG: CatalogItem[] = [
  // Agua
  C("agua-15", "Agua 1,5 L", "drop", "agua", 0, 1550, 1.5, 730, "botella", "agua", ["botella"]),
  C("agua-5", "Garrafa de agua 5 L", "drop-half", "agua", 0, 5100, 5, 730, "garrafa", "agua", ["garrafa"]),
  C("agua-05", "Agua 0,5 L", "drop-simple", "agua", 0, 520, 0.5, 730, "botellín", "agua", ["botellin"]),
  C("potabilizadoras", "Pastillas potabilizadoras", "flask", "agua", 0, 20, 0, 1825, "caja", "medicina", ["purificar"]),
  C("filtro-agua", "Filtro de agua portátil", "funnel", "agua", 0, 60, 0, null),

  // Comida
  C("racion", "Ración de emergencia", "package", "comida", 2400, 500, 0, 1825, "ud", "alimento", ["supervivencia"]),
  C("liofilizado", "Comida liofilizada", "bowl-steam", "comida", 500, 130, 0, 2555, "sobre", "alimento"),
  C("atun", "Lata de atún", "fish", "comida", 190, 110, 0, 1095, "lata", "alimento", ["bonito"]),
  C("sardinas", "Lata de sardinas", "fish-simple", "comida", 220, 125, 0, 1460, "lata", "alimento", ["caballa", "mejillones"]),
  C("garbanzos", "Garbanzos en bote", "jar", "comida", 480, 450, 0, 1095, "bote", "alimento", ["legumbre", "alubias", "judias"]),
  C("lentejas", "Lentejas preparadas", "bowl-food", "comida", 360, 450, 0, 1095, "lata", "alimento", ["legumbre"]),
  C("fabada", "Fabada en lata", "cooking-pot", "comida", 550, 450, 0, 1095, "lata", "alimento", ["cocido", "conserva"]),
  C("maiz", "Lata de maíz", "carrot", "comida", 230, 330, 0, 1095, "lata", "alimento"),
  C("melocoton", "Fruta en almíbar", "orange", "comida", 280, 470, 0, 1095, "lata", "alimento", ["melocoton", "piña"]),
  C("barrita", "Barrita energética", "grains", "comida", 220, 50, 0, 365, "ud", "alimento", ["cereales"]),
  C("frutos-secos", "Frutos secos 200 g", "acorn", "comida", 1200, 200, 0, 365, "bolsa", "alimento", ["almendras", "nueces", "cacahuetes"]),
  C("chocolate", "Chocolate 100 g", "cube", "comida", 540, 100, 0, 365, "tableta", "alimento"),
  C("galletas", "Galletas 500 g", "cookie", "comida", 2300, 500, 0, 270, "paquete", "alimento"),
  C("pan-tostado", "Pan tostado", "bread", "comida", 1100, 270, 0, 180, "paquete", "alimento", ["biscotes"]),
  C("miel", "Miel 500 g", "jar-label", "comida", 1520, 520, 0, 1095, "bote", "alimento"),
  C("crema-cacahuete", "Crema de cacahuete", "jar", "comida", 2000, 380, 0, 365, "bote", "alimento"),
  C("leche", "Leche UHT 1 L", "pint-glass", "comida", 640, 1050, 0, 180, "brick", "alimento", ["brick"]),
  C("arroz", "Arroz 1 kg", "grains", "comida", 3500, 1000, 0, 730, "paquete", "alimento"),
  C("pasta", "Pasta 500 g", "fork-knife", "comida", 1780, 500, 0, 730, "paquete", "alimento", ["macarrones", "espaguetis"]),
  C("aceite", "Aceite de oliva 1 L", "drop", "comida", 8100, 950, 0, 540, "botella", "alimento"),
  C("leche-infantil", "Leche infantil", "baby", "comida", 4000, 900, 0, 540, "bote", "alimento", ["bebe", "formula", "potito"]),

  // Luz y energía
  C("linterna", "Linterna", "flashlight", "luz-energia", 0, 150, 0, null),
  C("frontal", "Linterna frontal", "lightbulb-filament", "luz-energia", 0, 90, 0, null, "ud", undefined, ["frontal"]),
  C("pilas", "Pilas AA (pack 4)", "battery-full", "luz-energia", 0, 100, 0, 3650, "pack", "otro", ["baterias"]),
  C("powerbank", "Powerbank", "battery-charging", "luz-energia", 0, 250, 0, null, "ud", undefined, ["bateria externa", "cargador"]),
  C("solar", "Cargador solar", "sun", "luz-energia", 0, 400, 0, null),
  C("velas", "Velas", "flame", "luz-energia", 0, 300, 0, null, "pack", "otro"),
  C("hornillo", "Hornillo de camping", "campfire", "luz-energia", 0, 800, 0, null, "ud", undefined, ["camping gas", "cocina"]),

  // Comunicación
  C("radio", "Radio a pilas o dinamo", "radio", "comunicacion", 0, 300, 0, null),
  C("silbato", "Silbato", "megaphone", "comunicacion", 0, 15, 0, null),
  C("walkie", "Walkie-talkies", "broadcast", "comunicacion", 0, 400, 0, null),
  C("contactos-papel", "Contactos en papel", "address-book", "comunicacion", 0, 20, 0, null, "ud", undefined, ["agenda", "telefonos"]),

  // Botiquín
  C("botiquin", "Botiquín", "first-aid-kit", "botiquin", 0, 400, 0, 730, "ud", "medicina", ["primeros auxilios", "tiritas", "gasas"]),
  C("paracetamol", "Paracetamol", "pill", "botiquin", 0, 20, 0, 1460, "caja", "medicina"),
  C("ibuprofeno", "Ibuprofeno", "pill", "botiquin", 0, 20, 0, 1460, "caja", "medicina"),
  C("medicacion", "Medicación personal", "first-aid", "botiquin", 0, 50, 0, 365, "caja", "medicina", ["medicamento", "pastillas", "receta"]),
  C("suero", "Suero oral", "drop-half", "botiquin", 0, 30, 0, 1095, "caja", "medicina", ["rehidratacion"]),
  C("mascarillas", "Mascarillas", "virus", "botiquin", 0, 50, 0, 1825, "caja", "medicina"),
  C("guantes", "Guantes desechables", "hand", "botiquin", 0, 50, 0, 1825, "caja", "higiene"),
  C("termometro", "Termómetro", "thermometer", "botiquin", 0, 40, 0, null),

  // Herramientas
  C("navaja", "Navaja multiusos", "knife", "herramientas", 0, 150, 0, null, "ud", undefined, ["multiherramienta"]),
  C("mechero", "Mechero o cerillas", "flame", "herramientas", 0, 30, 0, null, "ud", undefined, ["encendedor", "cerillas"]),
  C("abrelatas", "Abrelatas", "wrench", "herramientas", 0, 60, 0, null),
  C("cinta", "Cinta americana", "scissors", "herramientas", 0, 200, 0, null),
  C("cuerda", "Cuerda", "link", "herramientas", 0, 300, 0, null),
  C("bolsas-basura", "Bolsas de basura", "trash", "herramientas", 0, 200, 0, null, "rollo", "higiene"),
  C("mapa", "Mapa en papel", "map-trifold", "herramientas", 0, 100, 0, null),
  C("brujula", "Brújula", "compass", "herramientas", 0, 50, 0, null),

  // Abrigo
  C("manta", "Manta térmica", "thermometer-hot", "abrigo", 0, 60, 0, null, "ud", undefined, ["mylar"]),
  C("saco", "Saco de dormir", "bed", "abrigo", 0, 1200, 0, null),
  C("poncho", "Poncho impermeable", "cloud-rain", "abrigo", 0, 200, 0, null, "ud", undefined, ["chubasquero"]),
  C("chaqueta", "Chaqueta de abrigo", "hoodie", "abrigo", 0, 600, 0, null, "ud", undefined, ["abrigo"]),
  C("calcetines", "Calcetines de repuesto", "sock", "abrigo", 0, 100, 0, null, "par"),

  // Documentos y dinero
  C("efectivo", "Dinero en efectivo", "money", "documentos", 0, 50, 0, null, "ud", undefined, ["billetes"]),
  C("documentos", "Copia de documentos", "identification-card", "documentos", 0, 50, 0, null, "ud", undefined, ["dni", "pasaporte", "seguro"]),
  C("funda", "Funda estanca", "folder-simple", "documentos", 0, 40, 0, null),

  // Higiene
  C("papel", "Papel higiénico", "toilet-paper", "higiene", 0, 100, 0, null, "rollo", "higiene"),
  C("jabon", "Gel o jabón", "hand-soap", "higiene", 0, 300, 0, 1095, "bote", "higiene", ["gel"]),
  C("toallitas", "Toallitas húmedas", "sparkle", "higiene", 0, 300, 0, 730, "paquete", "higiene"),
  C("cepillo", "Cepillo y pasta de dientes", "tooth", "higiene", 0, 100, 0, 730, "ud", "higiene"),
  C("higiene-femenina", "Higiene femenina", "flower", "higiene", 0, 200, 0, 1825, "paquete", "higiene", ["compresas", "tampones"]),
  C("panales", "Pañales", "baby-carriage", "higiene", 0, 1000, 0, null, "paquete", "higiene", ["bebe"]),

  // Mascotas
  C("pienso", "Pienso para mascota", "paw-print", "mascotas", 0, 2000, 0, 365, "saco", "alimento", ["perro", "gato", "comida mascota"]),
  C("correa", "Correa y transportín", "dog", "mascotas", 0, 800, 0, null, "ud", undefined, ["transportin"]),
];

export const CATALOG_BY_ID: Record<string, CatalogItem> = Object.fromEntries(CATALOG.map((c) => [c.id, c]));

// Cada categoría tiene su icono y su color (clases completas para que Tailwind las genere)
export type Tone = "sky" | "amber" | "rose" | "yellow" | "violet" | "slate" | "indigo" | "emerald" | "teal" | "orange" | "stone";

export const CAT_META: Record<KitCategory, { label: string; icon: string; tone: Tone }> = {
  agua: { label: "Agua", icon: "drop", tone: "sky" },
  comida: { label: "Comida", icon: "bowl-food", tone: "amber" },
  botiquin: { label: "Botiquín", icon: "first-aid-kit", tone: "rose" },
  "luz-energia": { label: "Luz", icon: "flashlight", tone: "yellow" },
  comunicacion: { label: "Avisos", icon: "radio", tone: "violet" },
  herramientas: { label: "Útiles", icon: "wrench", tone: "slate" },
  abrigo: { label: "Abrigo", icon: "hoodie", tone: "indigo" },
  documentos: { label: "Papeles", icon: "identification-card", tone: "emerald" },
  higiene: { label: "Higiene", icon: "hand-soap", tone: "teal" },
  mascotas: { label: "Mascotas", icon: "paw-print", tone: "orange" },
  otro: { label: "Otro", icon: "package", tone: "stone" },
};

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Búsqueda tolerante: sin tildes, por nombre y alias. */
export function searchCatalog(q: string, pool: CatalogItem[] = CATALOG): CatalogItem[] {
  const n = norm(q.trim());
  if (!n) return pool;
  return pool
    .map((c) => {
      const name = norm(c.name);
      const score = name.startsWith(n) ? 0 : name.includes(n) ? 1 : c.aliases?.some((a) => norm(a).includes(n)) ? 2 : -1;
      return { c, score };
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score)
    .map((x) => x.c);
}

/** Adivina el producto del catálogo más parecido a un nombre libre (escáner y entradas a mano).
 *  Manda la PRIMERA palabra con sentido: "Atún claro en aceite" → atún, no aceite. */
export function guessCatalog(name: string): CatalogItem | undefined {
  const tokens = norm(name).split(/[^a-z0-9ñ]+/).filter((t) => t.length >= 3 && !STOP.has(t));
  for (const t of tokens) {
    const hit = CATALOG.find((c) =>
      norm(c.name).split(/[^a-z0-9ñ]+/).some((w) => w === t || (t.length >= 4 && w.startsWith(t))) ||
      c.aliases?.some((a) => norm(a).split(" ").some((w) => w === t)),
    );
    if (hit) return hit;
  }
  return undefined;
}

const STOP = new Set(["lata", "bote", "pack", "paquete", "con", "sin", "para", "del", "las", "los", "una", "uno", "clara", "claro"]);

export const PANTRY_CATALOG = CATALOG.filter((c) => c.pantry);

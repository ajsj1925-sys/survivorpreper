// Todo lo "de negocio" en un solo sitio para poder cambiar marca, precio o enlaces sin tocar componentes.

export const BRAND = {
  name: "SurvivorOS",
  tagline: "Tu hogar preparado para cualquier emergencia",
  footer: "Hecho con SurvivorOS",
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://survivorpreper.netlify.app";

export const PRO = {
  price: "9€",
  priceNote: "Pago único de lanzamiento · de por vida para los primeros usuarios",
  paymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "",
  // Mientras no haya login + webhook (Fase 2), Pro funciona como LISTA DE ESPERA: no se cobra nada.
  live: process.env.NEXT_PUBLIC_PRO_LIVE === "1",
  features: [
    "Avisos de caducidad por email antes de que algo se estropee",
    "Sincronización entre móvil y ordenador",
    "Varios hogares (casa, segunda residencia, coche)",
    "Copia de seguridad en la nube",
  ],
};

// ⚠️ RELLENA ESTO antes de publicar (aviso legal obligatorio por la LSSI en España)
export const LEGAL = {
  owner: process.env.NEXT_PUBLIC_LEGAL_OWNER ?? "[Nombre y apellidos o empresa]",
  nif: process.env.NEXT_PUBLIC_LEGAL_NIF ?? "[NIF]",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? "[Dirección postal]",
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? "[email de contacto]",
  updated: "2 de noviembre de 2026",
};

// Estadísticas sin cookies (Umami Cloud). El ID no es secreto: va en el HTML de la web.
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "8b2193b4-5023-4c41-9142-44279bc5b79a";

export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "";

export function amazonSearchUrl(query: string) {
  const params = new URLSearchParams({ k: query });
  if (AMAZON_TAG) params.set("tag", AMAZON_TAG);
  return `https://www.amazon.es/s?${params.toString()}`;
}

// Supuestos de cálculo (editables por el usuario en el hogar)
export const DEFAULTS = {
  kcalAdult: 2000,
  kcalChild: 1400,
  waterPerPersonL: 3,
  targetHours: 72,
  maxBagKgPerAdult: 10,
};

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number | boolean>) => void };
  }
}

/** Eventos para medir el lanzamiento (Umami, sin cookies). Si no está configurado, no hace nada y nunca rompe la app. */
export function track(event: string, data?: Record<string, string | number | boolean>) {
  try {
    if (typeof window !== "undefined") window.umami?.track(event, data);
  } catch {
    // sin analítica (local, bloqueador…): no pasa nada
  }
}

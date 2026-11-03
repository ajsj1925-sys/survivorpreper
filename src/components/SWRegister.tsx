"use client";

import { useEffect } from "react";

/** Registra el service worker para que la app funcione sin conexión (clave en un apagón). */
export function SWRegister() {
  useEffect(() => {
    // En el ordenador (localhost) nunca guardamos copia: así siempre se ve la última versión mientras probamos
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
      caches?.keys().then((ks) => ks.filter((k) => k !== "survivoros-data").forEach((k) => caches.delete(k))).catch(() => {});
      return;
    }
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

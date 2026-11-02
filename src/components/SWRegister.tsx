"use client";

import { useEffect } from "react";

/** Registra el service worker para que la app funcione sin conexión (clave en un apagón). */
export function SWRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";
import { useHydrated, useStore, type Theme } from "@/lib/store";
import { Icon } from "./icons/Icon";

/**
 * Se ejecuta antes de pintar la página para que no haya "parpadeo" blanco en modo oscuro.
 * Lee la preferencia guardada por la app (localStorage) o la del sistema.
 */
export const themeInitScript = `(function(){try{var t=(JSON.parse(localStorage.getItem("survivoros-v1")||"{}").state||{}).theme||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#1c1917" : "#ea580c");
}

/** Mantiene la clase "dark" sincronizada con la preferencia y con el sistema. */
export function ThemeSync() {
  const theme = useStore((s) => s.theme);
  const hydrated = useHydrated();
  useEffect(() => {
    if (!hydrated) return;
    apply(theme);
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => apply("system");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [theme, hydrated]);
  return null;
}

const NEXT: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
const META: Record<Theme, { icon: string; label: string }> = {
  system: { icon: "circle-half", label: "Automático" },
  light: { icon: "sun", label: "Claro" },
  dark: { icon: "moon", label: "Oscuro" },
};

/** Botón que alterna Automático → Claro → Oscuro. */
export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const hydrated = useHydrated();
  const t = hydrated ? theme : "system";
  return (
    <button
      onClick={() => setTheme(NEXT[t])}
      aria-label={`Tema: ${META[t].label}. Cambiar`}
      title={`Tema: ${META[t].label}`}
      className="inline-flex items-center gap-2 rounded-full bg-white p-2 text-stone-600 shadow-sm ring-1 ring-stone-200 hover:bg-stone-50"
    >
      <Icon name={META[t].icon} className="h-5 w-5" />
      {withLabel && <span className="pr-1 text-xs font-medium">{META[t].label}</span>}
    </button>
  );
}

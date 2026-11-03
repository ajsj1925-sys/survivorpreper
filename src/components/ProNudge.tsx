"use client";

import { useEffect } from "react";
import { registerChange } from "@/lib/nudge";
import { useStore, useUI } from "@/lib/store";
import { track } from "@/lib/track";

/** ¿Está la persona en mitad de algo? (una ventana abierta o escribiendo) */
function busy() {
  const a = document.activeElement;
  return !!document.querySelector('[role="dialog"]') || (a instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
}

/** Cada cierto número de cambios (kit, despensa, plan) ofrece apuntarse a la lista de espera de Pro. */
export function ProNudge() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: string | null = null;
    const tryShow = (tries = 0) => {
      clearTimeout(timer);
      // Esperamos a que termine lo que está haciendo: nunca encima de otra ventana ni mientras escribe
      timer = setTimeout(() => {
        if (!pending) return;
        if (busy() || useUI.getState().paywallFeature) { if (tries < 40) tryShow(tries + 1); return; }
        track("pro_nudge", { feature: pending });
        useUI.getState().openPaywall(pending);
        pending = null;
      }, 1800);
    };
    const unsub = useStore.subscribe((s, prev) => {
      const changed = s.kit !== prev.kit || s.pantry !== prev.pantry || s.plan !== prev.plan || s.kits !== prev.kits || s.checkedEssentials !== prev.checkedEssentials;
      if (!changed || !s.household.onboarded) return;
      const feature = registerChange();
      if (feature) pending = feature;
      if (pending) tryShow();
    });
    return () => { unsub(); clearTimeout(timer); };
  }, []);
  return null;
}

"use client";

import { Check, Lock, X } from "lucide-react";
import { useEffect } from "react";
import { PRO } from "@/lib/config";
import { useStore, useUI } from "@/lib/store";
import { track } from "@/lib/track";
import { EmailCapture } from "./EmailCapture";
import { Button } from "./ui";
import { IconTile } from "./icons/Icon";

/** Botón de una función Pro. Abre el modal con el nombre de la función. */
export function ProButton({ feature, className }: { feature: string; className?: string }) {
  const open = useUI((s) => s.openPaywall);
  return (
    <Button variant="secondary" className={className} onClick={() => open(feature)}>
      <Lock className="h-4 w-4 text-brand-500" />
      {feature}
      <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">PRO</span>
    </Button>
  );
}

export function PaywallModal() {
  const feature = useUI((s) => s.paywallFeature);
  const close = useUI((s) => s.closePaywall);
  const email = useStore((s) => s.email);

  useEffect(() => {
    if (!feature) return;
    // Medimos qué función Pro despierta más interés: así sabemos qué construir primero
    track("pro_interest", { feature });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feature, close]);

  if (!feature) return null;

  const href =
    PRO.live && PRO.paymentLink
      ? `${PRO.paymentLink}${email ? `?prefilled_email=${encodeURIComponent(email)}` : ""}`
      : "";

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-4 sm:items-center"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <IconTile name="rocket-launch" tone="orange" size="md" />
          <button onClick={close} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <h2 id="paywall-title" className="mt-4 text-xl font-semibold">
          {href ? `Desbloquea SurvivorOS Pro por ${PRO.price}` : "SurvivorOS Pro llega pronto"}
        </h2>
        <p className="mt-1 text-sm text-stone-600">«{feature}» será parte de Pro.</p>
        <ul className="mt-4 space-y-2">
          {PRO.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              {f}
            </li>
          ))}
        </ul>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => track("pro_checkout", { feature })}
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600">
            Conseguir Pro · {PRO.price}
          </a>
        ) : (
          <EmailCapture
            source="pro-waitlist"
            className="mt-5"
            title="Apúntate a la lista de espera"
            subtitle={`Los primeros tendréis Pro de por vida por ${PRO.price}. No pagas nada ahora.`}
            cta="Avísame"
            done="✓ Estás en la lista. Te escribiremos en cuanto Pro esté listo."
          />
        )}
        <p className="mt-3 text-center text-xs text-stone-500">Todo lo gratuito sigue siendo gratis y tus datos se quedan en tu móvil.</p>
      </div>
    </div>
  );
}

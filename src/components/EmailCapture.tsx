"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { track } from "@/lib/track";
import { markProJoined } from "@/lib/nudge";
import { Button, cn } from "./ui";

/** Captura de email con consentimiento RGPD explícito. */
export function EmailCapture({
  source,
  className,
  title = "Recordatorio cada 6 meses para revisar tu kit",
  subtitle = "Gratis. Sin spam. Te das de baja con un clic.",
  cta = "Apuntarme",
  done = "✓ Apuntado. Te avisaremos para revisar tu kit.",
  plain = false,
}: {
  source: string;
  className?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  done?: string;
  plain?: boolean;
}) {
  const saved = useStore((s) => s.email);
  const setEmail = useStore((s) => s.setEmail);
  const [value, setValue] = useState(saved ?? "");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  // En la lista de espera de Pro dejamos volver a enviarlo aunque ya tengamos el email (es otra lista)
  if ((saved && source !== "pro-waitlist" && state === "idle") || state === "done") {
    return (
      <div className={cn("rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800", className)}>{done}</div>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(value) || !consent) return;
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, consent: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      // Si Brevo rechaza el email, lo decimos en vez de fingir que ha ido bien
      if (!data.ok && data.error && data.error !== "not-configured") {
        setError(data.message ?? "No hemos podido apuntarte. Inténtalo de nuevo en un rato.");
        setState("idle");
        track("email_error", { source, error: data.error });
        return;
      }
    } catch {
      // Sin conexión: lo guardamos en local y se reintentará más adelante
    }
    setEmail(value);
    if (source === "pro-waitlist") markProJoined();
    track("email_signup", { source });
    setState("done");
  }

  return (
    <form onSubmit={submit} className={cn("no-print", !plain && "rounded-2xl border border-brand-100 bg-brand-50 p-4", className)}>
      {title && (
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
          <Mail className="h-4 w-4" />
          {title}
        </div>
      )}
      {subtitle && <p className="mt-1 text-xs text-stone-600">{subtitle}</p>}
      <div className="mt-3 flex gap-2">
        <input
          type="email"
          required
          placeholder="tu@email.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1"
          aria-label="Email"
        />
        <Button type="submit" disabled={state === "sending" || !consent}>
          {cta}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
          {error}
        </p>
      )}
      <label className="mt-2 flex items-start gap-2 text-[11px] leading-snug text-stone-600">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 p-0" aria-label="Acepto la política de privacidad" />
        <span>
          Acepto recibir estos emails y la{" "}
          <Link href="/privacidad" target="_blank" className="underline">política de privacidad</Link>.
        </span>
      </label>
    </form>
  );
}

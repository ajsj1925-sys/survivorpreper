"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { CAT_META } from "@/lib/catalog";
import { BRAND, SITE_URL } from "@/lib/config";
import { downloadReviewCalendar } from "@/lib/ics";
import { recommendationStatus } from "@/lib/recommend";
import { mainKitItems, useHydrated, useStore } from "@/lib/store";
import { track } from "@/lib/track";
import { EmailCapture } from "@/components/EmailCapture";
import { Button, Card } from "@/components/ui";
import { IconTile } from "@/components/icons/Icon";

/** Lista del kit personalizada para imprimir o guardar como PDF. Se desbloquea dejando el email. */
export function KitPrint() {
  const hydrated = useHydrated();
  const s = useStore();
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;

  const h = s.household;
  const lines = recommendationStatus(h, mainKitItems(s.kit)).filter((l) => l.item);
  const groups = new Map<string, typeof lines>();
  for (const l of lines) groups.set(l.item.cat, [...(groups.get(l.item.cat) ?? []), l]);
  const who = [
    `${h.adults} adulto${h.adults === 1 ? "" : "s"}`,
    h.children ? `${h.children} niño${h.children === 1 ? "" : "s"}` : "",
    h.pets ? `${h.pets} mascota${h.pets === 1 ? "" : "s"}` : "",
  ].filter(Boolean).join(" · ");
  const today = new Date();
  const next = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
  const fmt = (d: Date) => d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  if (!s.email) {
    return (
      <div className="mx-auto max-w-lg">
        <Card className="text-center">
          <IconTile name="file-pdf" tone="rose" size="lg" className="mx-auto" />
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Tu lista del kit, lista para imprimir</h1>
          <p className="mt-1 text-sm text-stone-600">Calculada para tu casa ({who}): {lines.length} cosas con las cantidades exactas y casillas para tachar.</p>
          <div aria-hidden className="relative mt-4 overflow-hidden rounded-2xl bg-stone-50 p-4 text-left text-sm ring-1 ring-stone-200">
            {lines.slice(0, 4).map((l) => (
              <div key={l.item.id} className="flex justify-between border-b border-dotted border-stone-300 py-1.5"><span>☐ {l.item.name}</span><span className="font-semibold">{l.target}</span></div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-50" />
          </div>
          <EmailCapture source="pdf-kit" className="mt-5 text-left" title="Te la desbloqueamos con tu email"
            subtitle="Y cada 6 meses te recordamos revisar el kit. Sin spam, baja con un clic." cta="Ver mi lista" />
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/app" className="text-sm text-stone-500">← Volver</Link>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { downloadReviewCalendar(); track("calendar_reminder", { from: "pdf" }); }}>Recordatorio cada 6 meses</Button>
          <Button onClick={() => { track("print_kit"); window.print(); }}><Printer className="h-4 w-4" /> Imprimir o guardar PDF</Button>
        </div>
      </div>
      <p className="no-print mb-4 rounded-2xl bg-sky-50 p-3 text-xs text-sky-800 ring-1 ring-sky-100">Para el PDF: pulsa «Imprimir» y elige <b>Guardar como PDF</b> como impresora.</p>

      <article className="print-area mx-auto max-w-3xl rounded-3xl bg-white p-6 text-stone-900 shadow-sm ring-1 ring-stone-200 print:max-w-none print:p-0">
        <header className="flex items-start justify-between border-b-2 border-stone-900 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Kit de emergencia · 72 horas</div>
            <h1 className="text-2xl font-bold">{s.plan.householdName || "Mi casa"}</h1>
            <div className="text-sm text-stone-600">{who}</div>
          </div>
          <div className="rounded-lg bg-red-600 px-3 py-2 text-center text-white">
            <div className="text-[10px] font-semibold uppercase">Emergencias</div>
            <div className="text-2xl font-black leading-none">112</div>
          </div>
        </header>

        <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 print:grid-cols-2">
          {[...groups.entries()].map(([cat, ls]) => (
            <section key={cat} className="break-inside-avoid">
              <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">{CAT_META[cat as keyof typeof CAT_META]?.label ?? cat}</h2>
              <ul>
                {ls.map((l) => (
                  <li key={l.item.id} className="flex items-baseline gap-2 border-b border-dotted border-stone-300 py-1 text-sm">
                    <span className="inline-block h-3.5 w-3.5 shrink-0 translate-y-0.5 rounded-sm border-2 border-stone-700" aria-hidden />
                    <span className="flex-1">{l.item.name}</span>
                    <span className="font-semibold tabular-nums">{l.target}</span>
                    {l.have > 0 && <span className="text-[11px] text-emerald-700">(tienes {l.have})</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-5 grid gap-3 text-sm sm:grid-cols-3 print:grid-cols-3">
          <div className="rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200"><b>Agua</b><br />3 litros por persona y día. Gira las botellas: bebe las viejas y repón.</div>
          <div className="rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200"><b>Pilas y batería</b><br />Carga el powerbank y prueba linterna y radio en cada revisión.</div>
          <div className="rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200"><b>Próxima revisión</b><br />{fmt(next)}</div>
        </section>

        <footer className="mt-5 border-t border-stone-200 pt-2 text-center text-[11px] text-stone-500">
          {BRAND.footer} · {fmt(today)} · Calcula y actualiza tu kit gratis en {SITE_URL.replace(/^https?:\/\//, "")} · Información orientativa: sigue siempre a Protección Civil y al 112.
        </footer>
      </article>
    </>
  );
}

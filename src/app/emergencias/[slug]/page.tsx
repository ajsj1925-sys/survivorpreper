import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { REGION_BY_SLUG, REGIONS, RISKS } from "@/lib/regions";
import { EmailCapture } from "@/components/EmailCapture";
import { IconTile } from "@/components/icons/Icon";
import { Article, JsonLd, PublicFooter, PublicHeader } from "@/components/PublicShell";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return REGIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const r = REGION_BY_SLUG[(await params).slug];
  if (!r) return {};
  const title = `Emergencias ${r.en}: riesgos, 112 y kit de emergencia`;
  const description = `Qué riesgos hay ${r.en} (${r.risks.slice(0, 3).map((k) => RISKS[k].label.toLowerCase()).join(", ")}), el teléfono y la web del ${r.service} y qué tener preparado en casa.`;
  return { title, description, alternates: { canonical: `/emergencias/${r.slug}` }, openGraph: { title, description, type: "article" } };
}

export default async function RegionPage({ params }: { params: Params }) {
  const r = REGION_BY_SLUG[(await params).slug];
  if (!r) notFound();
  const others = REGIONS.filter((o) => o.slug !== r.slug);
  const faq = [
    { q: `¿Cuál es el teléfono de emergencias ${r.en}?`, a: `El 112, gratuito y disponible las 24 horas. Lo gestiona ${r.service}. Funciona aunque no tengas saldo, y desde muchos móviles también sin tarjeta SIM.` },
    { q: `¿Qué riesgos son más habituales ${r.en}?`, a: `${r.risks.map((k) => RISKS[k].label).join(", ")}. ${r.note}` },
    { q: "¿Cómo me entero de los avisos?", a: "Por los avisos de AEMET, las redes y la web del 112 de tu comunidad y, si la emergencia es grave, por un mensaje ES-Alert que suena en el móvil aunque esté en silencio." },
    { q: "¿Qué debo tener preparado en casa?", a: "Lo necesario para aguantar 72 horas: 3 litros de agua por persona y día, comida que no haya que cocinar, linterna, radio a pilas, botiquín, medicinas, efectivo y copia de los documentos." },
  ];
  return (
    <>
      <PublicHeader />
      <Article>
        <IconTile name="map-pin" tone="orange" size="lg" />
        <h1 className="mt-4">Emergencias {r.en}: riesgos, 112 y cómo prepararte</h1>
        <p>{r.note} Aquí tienes lo esencial para que tu casa esté preparada.</p>

        <div className="not-prose my-6 flex items-center gap-4 rounded-3xl bg-red-600 p-5 text-white">
          <div className="text-5xl font-black leading-none">112</div>
          <div>
            <div className="font-semibold">{r.service}</div>
            <div className="text-sm text-red-100">Gratis, 24 horas. Solo para emergencias reales.</div>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-medium underline">Web oficial ↗</a>
          </div>
        </div>

        <h2>Riesgos más habituales {r.en}</h2>
        <div className="not-prose mt-3 grid gap-3">
          {r.risks.map((k) => {
            const risk = RISKS[k];
            const inner = (
              <>
                <IconTile name={risk.icon} tone="orange" size="sm" />
                <div className="flex-1">
                  <div className="font-semibold">{risk.label}</div>
                  <div className="text-sm text-stone-600">{risk.tip}</div>
                </div>
                {risk.guide && <span className="text-sm font-medium text-brand-600">Guía →</span>}
              </>
            );
            return risk.guide ? (
              <Link key={k} href={`/guias/${risk.guide}`} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200 hover:ring-brand-500">{inner}</Link>
            ) : (
              <div key={k} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200">{inner}</div>
            );
          })}
        </div>

        <h2>Qué tener preparado en casa</h2>
        <ul>
          <li>Agua: 3 litros por persona y día, para 3 días.</li>
          <li>Comida que no haya que cocinar: latas, barritas, frutos secos.</li>
          <li>Linterna o frontal, radio a pilas y pilas de repuesto.</li>
          <li>Botiquín y tus medicinas habituales para una semana.</li>
          <li>Dinero en efectivo y copia de los documentos en una funda impermeable.</li>
          <li>Un plan familiar: teléfonos y punto de encuentro.</li>
        </ul>
        <div className="not-prose mt-6">
          <Link href="/app" className="inline-block rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600">Calcula tu kit para tu familia (gratis) →</Link>
        </div>

        <h2>Cómo enterarte de los avisos</h2>
        <ul>
          <li><a href="https://www.aemet.es/es/eltiempo/prediccion/avisos" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Avisos de AEMET</a> por lluvia, viento, calor o nieve.</li>
          <li>La web y las redes oficiales del {r.service}.</li>
          <li>Los mensajes <Link href="/guias/alerta-es-alert-movil" className="text-brand-600 underline">ES-Alert</Link> que suenan en el móvil en emergencias graves.</li>
          <li>Una radio a pilas, por si se cae la red.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        {faq.map((f) => (
          <details key={f.q} className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="!mt-2 text-stone-600">{f.a}</p>
          </details>
        ))}

        <EmailCapture source={`region-${r.slug}`} className="mt-10" />

        <h2>Otras comunidades</h2>
        <p className="text-sm">
          {others.map((o, i) => (
            <span key={o.slug}>
              <Link href={`/emergencias/${o.slug}`} className="text-brand-600 underline">{o.name}</Link>{i < others.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
        <p className="text-sm text-stone-500">Información orientativa. Sigue siempre las indicaciones de Protección Civil, del 112 y de las autoridades de tu comunidad.</p>
      </Article>
      <PublicFooter />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}

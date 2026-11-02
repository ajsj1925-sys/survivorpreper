import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, GUIDE_BY_SLUG } from "@/lib/guides";
import { EmailCapture } from "@/components/EmailCapture";
import { FoodCalculator } from "@/components/FoodCalculator";
import { IconTile } from "@/components/icons/Icon";
import { Article, JsonLd, PublicFooter, PublicHeader } from "@/components/PublicShell";
import { WaterCalculator } from "@/components/WaterCalculator";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const g = GUIDE_BY_SLUG[(await params).slug];
  if (!g) return {};
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: { title: g.metaTitle, description: g.description, type: "article" },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const g = GUIDE_BY_SLUG[(await params).slug];
  if (!g) notFound();
  const others = GUIDES.filter((o) => o.slug !== g.slug).slice(0, 3);

  return (
    <>
      <PublicHeader />
      <Article>
        <IconTile name={g.icon} tone="orange" size="lg" />
        <h1 className="mt-4">{g.title}</h1>
        <p>{g.intro}</p>

        {g.tool === "food" && <FoodCalculator />}
        {g.tool === "water" && <WaterCalculator />}

        {g.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p && <p>{s.p}</p>}
            {s.items && (
              <ul>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className="mt-8">
          <Link href={g.cta.href} className="inline-block rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600">
            {g.cta.label} →
          </Link>
        </div>

        <h2>Preguntas frecuentes</h2>
        {g.faq.map((f) => (
          <details key={f.q} className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="!mt-2 text-stone-600">{f.a}</p>
          </details>
        ))}

        <EmailCapture source={`guia-${g.slug}`} className="mt-10" />

        <h2>Sigue leyendo</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/guias/${o.slug}`} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-sm font-medium ring-1 ring-stone-200 hover:ring-brand-500">
              <IconTile name={o.icon} tone="stone" size="sm" /> {o.title.split(":")[0]}
            </Link>
          ))}
        </div>

        <h2>Fuentes</h2>
        <ul className="text-sm">
          {g.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">{s.label}</a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-stone-500">Información orientativa. Sigue siempre las indicaciones de Protección Civil y del 112.</p>
      </Article>
      <PublicFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}

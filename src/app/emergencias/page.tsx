import type { Metadata } from "next";
import Link from "next/link";
import { REGIONS } from "@/lib/regions";
import { IconTile } from "@/components/icons/Icon";
import { PublicFooter, PublicHeader } from "@/components/PublicShell";

export const metadata: Metadata = {
  title: "Emergencias por comunidad autónoma: riesgos y 112",
  description: "Qué riesgos hay en tu comunidad autónoma (DANA, incendios, nevadas, terremotos…), cuál es tu servicio 112 y cómo preparar tu casa.",
  alternates: { canonical: "/emergencias" },
};

export default function RegionsIndex() {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Emergencias en tu comunidad</h1>
        <p className="mt-2 max-w-2xl text-stone-600">Cada zona tiene sus riesgos: no es lo mismo una DANA en Valencia que una nevada en Soria. Elige tu comunidad y mira qué te conviene tener preparado.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => (
            <Link key={r.slug} href={`/emergencias/${r.slug}`} className="flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-stone-200 transition hover:ring-brand-500">
              <IconTile name="map-pin" tone="orange" size="sm" />
              <span className="font-semibold">{r.name}</span>
            </Link>
          ))}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}

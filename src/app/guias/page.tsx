import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, LEGACY_GUIDES } from "@/lib/guides";
import { IconTile } from "@/components/icons/Icon";
import { PublicFooter, PublicHeader } from "@/components/PublicShell";

export const metadata: Metadata = {
  title: "Guías de preparación ante emergencias",
  description: "Guías prácticas para preparar tu hogar: kit de 72 horas, agua, comida, apagones, coche, bebés, mascotas y botiquín.",
  alternates: { canonical: "/guias" },
};

export default function GuidesIndex() {
  const all = [...LEGACY_GUIDES, ...GUIDES.map((g) => ({ slug: g.slug, icon: g.icon, title: g.title, description: g.description }))];
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Guías de preparación</h1>
        <p className="mt-2 max-w-2xl text-stone-600">Todo lo que necesitas saber para que tu casa aguante un apagón o una emergencia, explicado en corto y con listas prácticas.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {all.map((g) => (
            <Link key={g.slug} href={`/guias/${g.slug}`} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-stone-200 transition hover:ring-brand-500">
              <IconTile name={g.icon} tone="orange" size="md" />
              <div>
                <h2 className="font-semibold leading-snug">{g.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-stone-600">{g.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}

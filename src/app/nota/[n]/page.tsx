import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/config";
import { clampScore, scoreLabel } from "@/lib/score";
import { PublicFooter, PublicHeader } from "@/components/PublicShell";
import { Ring } from "@/components/visual";

type Params = Promise<{ n: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const n = clampScore((await params).n);
  const title = `Este hogar está preparado al ${n}% para una emergencia`;
  return {
    title,
    description: `¿Y el tuyo? Calcula gratis en 1 minuto cuántas horas aguantaría tu casa sin luz ni agua con ${BRAND.name}.`,
    openGraph: { title, description: "¿Y el tuyo? Compruébalo gratis en 1 minuto." },
    robots: { index: false },
  };
}

/** Página que se abre al compartir la nota: muestra la nota y empuja a calcular la tuya. */
export default async function NotaPage({ params }: { params: Params }) {
  const n = clampScore((await params).n);
  const lab = scoreLabel(n);
  return (
    <>
      <PublicHeader />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">Un hogar preparado al</p>
        <div className="mt-6">
          <Ring pct={n} color={lab.stroke} size={200} stroke={18}>
            <span className="text-6xl font-black tabular-nums" style={{ color: lab.stroke }}>{n}%</span>
          </Ring>
        </div>
        <p className={`mt-4 text-2xl font-bold ${lab.tone}`}>{lab.text}</p>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">¿Y el tuyo?</h1>
        <p className="mt-2 text-stone-600">Descubre en 1 minuto cuántas horas aguantaría tu casa sin luz ni agua. Gratis y sin registro.</p>
        <Link href="/app" className="mt-6 w-full rounded-2xl bg-brand-500 py-4 text-lg font-semibold text-white shadow-sm hover:bg-brand-600">
          Calcular mi nota →
        </Link>
      </main>
      <PublicFooter />
    </>
  );
}

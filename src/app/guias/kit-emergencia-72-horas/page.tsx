import type { Metadata } from "next";
import Link from "next/link";
import { ESSENTIALS } from "@/lib/essentials";
import { EmailCapture } from "@/components/EmailCapture";
import { Article, JsonLd, PublicFooter, PublicHeader } from "@/components/PublicShell";

export const metadata: Metadata = {
  title: "Kit de emergencia 72 horas: lista completa para tu casa",
  description:
    "Qué meter en un kit de emergencia de 72 horas para un apagón o una emergencia: agua, comida, radio, linterna, botiquín y documentos. Lista imprimible y calculadora gratis.",
  alternates: { canonical: "/guias/kit-emergencia-72-horas" },
};

export default function Guide72h() {
  return (
    <>
      <PublicHeader />
      <Article>
        <h1>Kit de emergencia de 72 horas: la lista completa</h1>
        <p>
          Las autoridades europeas recomiendan que cada hogar pueda valerse por sí mismo durante al menos
          72 horas en caso de emergencia: un apagón, una inundación o un corte de suministro. Es el tiempo que
          pueden tardar en llegar la ayuda o en restablecerse los servicios.
        </p>
        <p>
          Esta es la lista básica. Puedes imprimirla o, mejor, usar la{" "}
          <Link href="/app/kit" className="font-medium text-brand-600 underline">calculadora gratuita</Link>{" "}
          para saber cuántas horas aguanta tu hogar con lo que ya tienes.
        </p>

        <h2>Lista de comprobación</h2>
        <ul>
          {ESSENTIALS.map((e) => (
            <li key={e.id}>
              {e.emoji} <b>{e.label}</b>: {e.hint}
            </li>
          ))}
        </ul>

        <h2>Errores habituales</h2>
        <ul>
          <li>Calcular la comida y olvidarse del agua, que es lo primero que se acaba.</li>
          <li>Guardar el kit y no revisarlo nunca: las pilas se descargan y la comida caduca.</li>
          <li>Depender del móvil: sin cobertura ni batería no hay mapas ni avisos.</li>
          <li>No acordar un punto de encuentro con la familia.</li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app/kit" className="rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600">
            Calcular mi kit gratis
          </Link>
          <Link href="/app/plan" className="rounded-xl border border-stone-300 bg-white px-5 py-3 font-semibold hover:bg-stone-100">
            Crear plan familiar
          </Link>
        </div>

        <EmailCapture source="guia-72h" className="mt-10" />
      </Article>
      <PublicFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Cómo preparar un kit de emergencia de 72 horas",
          step: ESSENTIALS.map((e, i) => ({ "@type": "HowToStep", position: i + 1, name: e.label, text: e.hint })),
        }}
      />
    </>
  );
}

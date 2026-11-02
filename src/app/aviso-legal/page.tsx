import type { Metadata } from "next";
import { BRAND, LEGAL, SITE_URL } from "@/lib/config";
import { Article, PublicFooter, PublicHeader } from "@/components/PublicShell";

export const metadata: Metadata = { title: "Aviso legal", robots: { index: false } };

export default function AvisoLegal() {
  return (
    <>
      <PublicHeader />
      <Article>
        <h1>Aviso legal</h1>
        <p className="text-sm text-stone-500">Última actualización: {LEGAL.updated}</p>

        <h2>Titular del sitio web</h2>
        <p>
          En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI), se informa de que {BRAND.name} ({SITE_URL.replace(/^https?:\/\//, "")}) es
          titularidad de <b>{LEGAL.owner}</b>, con NIF <b>{LEGAL.nif}</b>, domicilio en {LEGAL.address} y correo de contacto <b>{LEGAL.email}</b>.
        </p>

        <h2>Objeto</h2>
        <p>
          {BRAND.name} es una herramienta gratuita para ayudar a los hogares a prepararse ante emergencias: calcular un kit de 72 horas,
          controlar caducidades y organizar un plan familiar.
        </p>

        <h2>Información orientativa</h2>
        <p>
          Los cálculos (calorías, litros, caducidades) son <b>valores medios orientativos</b>. No sustituyen las indicaciones de Protección
          Civil, del 112 ni de profesionales sanitarios. Ante una emergencia, sigue siempre las instrucciones oficiales.
        </p>

        <h2>Enlaces de afiliado</h2>
        <p>
          Algunos enlaces llevan a tiendas externas como Amazon. Como Afiliado de Amazon, el titular obtiene ingresos por las compras
          adscritas que cumplen los requisitos aplicables. El precio para ti es el mismo.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          El titular no se responsabiliza del mal uso de la información ni de los contenidos de webs de terceros enlazadas. Los datos
          que introduces en la app se guardan en tu dispositivo; eres responsable de conservarlos (puedes exportar una copia desde Inicio).
        </p>

        <h2>Propiedad intelectual</h2>
        <p>Los textos, el diseño y el código de {BRAND.name} pertenecen a su titular. No se permite su reproducción sin autorización.</p>

        <h2>Legislación aplicable</h2>
        <p>Este aviso se rige por la legislación española.</p>
      </Article>
      <PublicFooter />
    </>
  );
}

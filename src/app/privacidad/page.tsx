import type { Metadata } from "next";
import { BRAND, LEGAL } from "@/lib/config";
import { Article, PublicFooter, PublicHeader } from "@/components/PublicShell";

export const metadata: Metadata = { title: "Privacidad y cookies", robots: { index: false } };

export default function Privacidad() {
  return (
    <>
      <PublicHeader />
      <Article>
        <h1>Política de privacidad y cookies</h1>
        <p className="text-sm text-stone-500">Última actualización: {LEGAL.updated}</p>

        <h2>Lo importante en 3 líneas</h2>
        <ul>
          <li>Tu kit, tu despensa y tu plan familiar <b>se guardan solo en tu dispositivo</b>. No los recibimos.</li>
          <li>Solo tratamos tu <b>email</b> si nos lo das, para lo que tú pidas (recordatorios, novedades o lista de espera de Pro).</li>
          <li><b>No usamos cookies</b> de publicidad ni de seguimiento.</li>
        </ul>

        <h2>Responsable</h2>
        <p>{LEGAL.owner} · NIF {LEGAL.nif} · {LEGAL.address} · {LEGAL.email}</p>

        <h2>Qué datos tratamos y para qué</h2>
        <ul>
          <li>
            <b>Datos de la app</b> (productos, fechas, miembros del hogar, teléfonos del plan): se almacenan en el almacenamiento local de tu
            navegador. No salen de tu dispositivo salvo que tú los exportes o los compartas.
          </li>
          <li>
            <b>Email</b>: para enviarte recordatorios para revisar tu kit, novedades de {BRAND.name} y, si te apuntas, avisarte cuando salga Pro.
            Base legal: tu consentimiento (art. 6.1.a RGPD), que puedes retirar en cualquier momento con el enlace de baja de cada email
            o escribiendo a {LEGAL.email}. Lo conservamos hasta que te des de baja.
          </li>
          <li>
            <b>Estadísticas de uso</b>: usamos Umami, que mide visitas de forma agregada y <b>sin cookies</b> ni identificarte.
          </li>
          <li>
            <b>Escáner de códigos</b>: el número del código de barras se consulta en Open Food Facts (base de datos pública). No se envía
            ningún dato tuyo.
          </li>
        </ul>

        <h2>Proveedores</h2>
        <ul>
          <li>Brevo (Sendinblue SAS, Francia, UE): envío de emails.</li>
          <li>Netlify, Inc. (EE. UU.): alojamiento de la web.</li>
          <li>Umami Software (Umami Cloud): estadísticas agregadas sin cookies.</li>
        </ul>
        <p>No vendemos ni cedemos tus datos a terceros.</p>

        <h2>Tus derechos</h2>
        <p>
          Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {LEGAL.email}. Si no te
          atendemos bien, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
        </p>

        <h2>Cookies y almacenamiento local</h2>
        <p>
          {BRAND.name} no instala cookies propias. Usa el almacenamiento local del navegador solo para guardar tus datos de la app y que
          funcione sin conexión; es técnicamente necesario y no requiere consentimiento. Si pulsas un enlace a Amazon u otra tienda,
          esa web puede usar sus propias cookies según su política.
        </p>
      </Article>
      <PublicFooter />
    </>
  );
}

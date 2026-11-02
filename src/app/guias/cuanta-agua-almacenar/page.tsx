import type { Metadata } from "next";
import Link from "next/link";
import { EmailCapture } from "@/components/EmailCapture";
import { Article, PublicFooter, PublicHeader } from "@/components/PublicShell";
import { WaterCalculator } from "@/components/WaterCalculator";

export const metadata: Metadata = {
  title: "¿Cuánta agua almacenar para una emergencia? Calculadora",
  description:
    "Calcula cuántos litros de agua necesita tu familia para 3 días de emergencia o un apagón. Cómo almacenarla, cuánto dura y cada cuánto renovarla.",
  alternates: { canonical: "/guias/cuanta-agua-almacenar" },
};

export default function WaterGuide() {
  return (
    <>
      <PublicHeader />
      <Article>
        <h1>¿Cuánta agua almacenar para una emergencia?</h1>
        <p>
          La referencia más habitual es de <b>unos 3 litros por persona y día</b>, contando beber y una higiene
          mínima. Para un kit de 72 horas, eso son unos 9 litros por persona. Si hace calor, hay niños pequeños,
          personas mayores o mascotas, conviene guardar más.
        </p>

        <WaterCalculator />

        <h2>Cómo almacenarla</h2>
        <ul>
          <li>Mejor botellas comerciales cerradas: aguantan más y no hay que tratarlas.</li>
          <li>Lugar fresco, oscuro y lejos de productos químicos o combustibles.</li>
          <li>Apunta la fecha de caducidad y rota: bébela antes de que caduque y repón.</li>
        </ul>

        <h2>¿Cada cuánto renovarla?</h2>
        <p>
          El agua embotellada lleva fecha de consumo preferente. Lo práctico es revisarla dos veces al año. En la{" "}
          <Link href="/app/despensa" className="font-medium text-brand-600 underline">despensa de la app</Link>{" "}
          verás en rojo lo que caduca en menos de 30 días.
        </p>

        <EmailCapture source="guia-agua" className="mt-10" />
      </Article>
      <PublicFooter />
    </>
  );
}

import Link from "next/link";
import { BRAND, PRO } from "@/lib/config";
import { EmailCapture } from "@/components/EmailCapture";
import { JsonLd, PublicFooter, PublicHeader } from "@/components/PublicShell";
import { Ring } from "@/components/visual";
import { Icon, IconTile } from "@/components/icons/Icon";
import type { Tone } from "@/lib/catalog";

const FAQ = [
  { q: "¿Necesito registrarme?", a: "No. Todo funciona en tu navegador y tus datos se quedan en tu móvil. Puedes instalarla como una app desde el navegador." },
  { q: "¿Funciona sin internet?", a: "Sí. Una vez instalada, puedes consultar tu kit, tu despensa, tu plan y el modo apagón aunque se caiga la red." },
  { q: "¿Cuánta agua y comida necesito para 72 horas?", a: "Como referencia habitual, unos 3 litros de agua por persona y día y alimentos que no necesiten cocinarse. La app lo calcula para tu hogar, mascotas incluidas." },
  { q: "¿Es gratis?", a: `Sí, todo lo que ves es gratis. Más adelante habrá un plan Pro opcional (avisos por email, sincronización y varios hogares) por ${PRO.price} de por vida para los primeros.` },
];

const FEATURES: [string, Tone, string, string][] = [
  ["backpack", "orange", "Kit 72 h en un minuto", "Toca lo que tienes: las calorías, el agua y la caducidad ya vienen puestas."],
  ["seal-check", "emerald", "Tu nota de 0 a 100", "Sabrás lo preparado que está tu hogar y cuál es el siguiente paso."],
  ["basket", "amber", "Despensa sin líos", "Escanea el código, la caducidad se calcula sola y te avisa de lo que hay que consumir."],
  ["shopping-cart", "teal", "Lista de la compra automática", "Lo que te falta y lo que caduca, en una lista que puedes enviar."],
  ["users-three", "violet", "Plan familiar imprimible", "Puntos de encuentro, teléfonos y medicación en una hoja para la nevera."],
  ["lightning", "yellow", "Modo apagón", "Qué hacer paso a paso cuando se va la luz. Funciona sin conexión."],
];

/** Maqueta de móvil hecha con los mismos componentes de la app. */
function PhoneMock() {
  return (
    <div className="mx-auto w-64 rounded-[2.5rem] border-[10px] border-stone-900 bg-stone-50 p-4 shadow-2xl" aria-hidden>
      <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
        <Ring pct={76} color="#65a30d" size={120} stroke={12}>
          <span className="text-3xl font-black text-lime-600">76</span>
          <span className="text-[10px] text-stone-500">de 100</span>
        </Ring>
        <div className="mt-2 text-sm font-bold text-lime-600">Bien encaminados</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="flex flex-col items-center rounded-2xl bg-white p-2 shadow-sm"><Icon name="backpack" className="h-6 w-6 text-orange-500" /><div className="text-sm font-bold">72 h</div></div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-2 shadow-sm"><Icon name="house" className="h-6 w-6 text-sky-500" /><div className="text-sm font-bold">9 días</div></div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {["drop", "bowl-food", "radio", "flashlight", "first-aid-kit", "battery-charging", "money", "thermometer-hot"].map((e, i) => (
          <div key={e} className={`flex h-11 items-center justify-center rounded-xl ${i < 6 ? "bg-emerald-50 text-emerald-600 ring-2 ring-emerald-400" : "bg-stone-100 text-stone-400"}`}><Icon name={e} className="h-6 w-6" /></div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-14 pt-12 md:grid-cols-[1fr_auto] md:pt-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">{BRAND.tagline}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">¿Cuántas horas aguantaría tu casa sin luz ni agua?</h1>
            <p className="mt-5 max-w-xl text-lg text-stone-600">
              Descúbrelo en 1 minuto y prepara tu hogar para el próximo apagón: kit de 72 horas, despensa y plan familiar. Gratis, sin registro y funciona sin conexión.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/app" className="rounded-2xl bg-brand-500 px-7 py-4 text-lg font-semibold text-white shadow-sm hover:bg-brand-600">
                Calcular mi nota gratis →
              </Link>
              <Link href="/guias/kit-emergencia-72-horas" className="rounded-2xl border border-stone-300 bg-white px-6 py-4 font-semibold hover:bg-stone-100">
                Ver la lista del kit
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-sm text-stone-500"><Icon name="shield-check" className="h-5 w-5 text-brand-500" /> Basado en la recomendación europea de 72 horas de autonomía.</p>
          </div>
          <PhoneMock />
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([e, tone, t, d]) => (
              <div key={t} className="rounded-3xl border border-stone-200 bg-white p-5">
                <IconTile name={e} tone={tone} size="lg" />
                <h2 className="mt-3 font-semibold">{t}</h2>
                <p className="mt-1 text-sm text-stone-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold">Así de fácil</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[["1", "users-three", "Dinos cuántos sois", "Adultos, niños y mascotas."], ["2", "hand-tap", "Toca lo que tienes", "Agua, latas, linterna… sin escribir."], ["3", "check-circle", "Completa lo que falta", "Con tu lista de la compra y tu plan."]].map(([n, e, t, d]) => (
              <div key={n} className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-stone-200">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white">{n}</span>
                <div><div className="flex items-center gap-1.5 font-semibold"><Icon name={e} className="h-5 w-5 text-brand-500" /> {t}</div><div className="text-sm text-stone-600">{d}</div></div>
              </div>
            ))}
          </div>
          <figure className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <video controls playsInline preload="none" poster="/videos/tutorial-poster.jpg" className="aspect-video w-full bg-stone-100" aria-label="Tutorial: cómo usar Mi Plan B en 9 pasos">
              <source src="/videos/tutorial.mp4" type="video/mp4" />
            </video>
            <figcaption className="px-5 py-3 text-center text-sm text-stone-600">Mira cómo funciona en 2 minutos</figcaption>
          </figure>
        </section>

        <section className="mx-auto mt-16 max-w-2xl px-4">
          <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
          <div className="mt-4 divide-y divide-stone-200">
            {FAQ.map((f) => (
              <details key={f.q} className="py-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
          <EmailCapture source="landing" className="mt-10" />
        </section>
      </main>
      <PublicFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}

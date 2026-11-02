import Link from "next/link";
import { Logo } from "./Logo";
import { BRAND } from "@/lib/config";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/guias/kit-emergencia-72-horas" className="hidden text-stone-600 hover:text-stone-900 sm:inline">
            Guía kit 72 h
          </Link>
          <Link href="/app" className="rounded-lg bg-brand-500 px-3 py-1.5 font-medium text-white hover:bg-brand-600">
            Abrir app
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 py-8 text-sm text-stone-500">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} {BRAND.name}. Información orientativa: sigue siempre las indicaciones de Protección Civil y del 112.</span>
        <div className="flex flex-wrap gap-4">
          <Link href="/guias/kit-emergencia-72-horas" className="hover:text-stone-800">Kit 72 h</Link>
          <Link href="/guias/cuanta-agua-almacenar" className="hover:text-stone-800">Agua</Link>
          <Link href="/aviso-legal" className="hover:text-stone-800">Aviso legal</Link>
          <Link href="/privacidad" className="hover:text-stone-800">Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

/** Estilos de artículo sin plugin de tipografía. */
export function Article({ children }: { children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-4 pt-10 text-[17px] leading-relaxed text-stone-800 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-stone-900 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stone-900 [&_li]:mt-1 [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </article>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

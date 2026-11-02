"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Backpack, BookOpen, House, Package, ShieldCheck, ShoppingCart, Users, Zap } from "lucide-react";
import { BRAND } from "@/lib/config";
import { cn } from "./ui";
import { ProButton } from "./Paywall";

const NAV = [
  { href: "/app", label: "Inicio", icon: House },
  { href: "/app/kit", label: "Kit 72 h", icon: Backpack },
  { href: "/app/despensa", label: "Despensa", icon: Package },
  { href: "/app/compra", label: "Compra", icon: ShoppingCart },
  { href: "/app/plan", label: "Plan", icon: Users },
];

const isActive = (path: string | null, href: string) => (href === "/app" ? path === "/app" : !!path?.startsWith(href));

export function Sidebar() {
  const path = usePathname();
  return (
    <>
      {/* Escritorio: menú lateral */}
      <aside className="no-print fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-stone-200 bg-white p-4 md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <ShieldCheck className="h-7 w-7 text-brand-500" />
          <span className="text-lg font-bold tracking-tight">{BRAND.name}</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive(path, href) ? "bg-brand-50 text-brand-700" : "text-stone-600 hover:bg-stone-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/app/apagon"
            className="mt-4 flex items-center gap-3 rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            Modo apagón
          </Link>
          <Link
            href="/guias/kit-emergencia-72-horas"
            className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100"
          >
            <BookOpen className="h-4 w-4" />
            Guías
          </Link>
        </nav>
        <div className="mt-auto">
          <ProButton feature="Varios hogares" className="w-full text-xs" />
          <p className="mt-3 px-1 text-[11px] leading-snug text-stone-400">
            Tus datos se guardan solo en este dispositivo. Funciona sin conexión.
          </p>
          <p className="mt-2 px-1 text-[11px] text-stone-400">
            <Link href="/aviso-legal" className="hover:underline">Aviso legal</Link> · <Link href="/privacidad" className="hover:underline">Privacidad</Link>
          </p>
        </div>
      </aside>

      {/* Móvil: barra inferior */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              isActive(path, href) ? "text-brand-600" : "text-stone-500",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}

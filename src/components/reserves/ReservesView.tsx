"use client";

import Link from "next/link";
import { useHydrated } from "@/lib/store";
import { IconTile } from "@/components/icons/Icon";
import { AutonomyPanel } from "./AutonomyPanel";

const SECTIONS = [
  { href: "/app/agua", icon: "drop", tone: "sky" as const, title: "Agua", text: "Bidones, potabilizar y agua de reserva en casa" },
  { href: "/app/energia", icon: "battery-charging", tone: "yellow" as const, title: "Luz, energía y cocina", text: "Pilas, powerbanks y gas: horas de luz y comidas calientes" },
  { href: "/app/menu", icon: "chef-hat", tone: "amber" as const, title: "Menú de emergencia", text: "Qué coméis cada día con lo que hay en la despensa" },
  { href: "/app/escenarios", icon: "list-checks", tone: "violet" as const, title: "Escenarios", text: "Apagón, confinamiento, corte de agua y evacuación" },
  { href: "/app/despensa", icon: "basket", tone: "emerald" as const, title: "Despensa", text: "Rotación, mínimos, recetas y equilibrio de nutrientes" },
  { href: "/app/plan", icon: "users-three", tone: "rose" as const, title: "Plan familiar", text: "Teléfonos y punto de encuentro" },
];

export function ReservesView() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;
  return (
    <>
      <h1 className="mb-4 flex items-center gap-2.5 text-2xl font-bold tracking-tight"><IconTile name="warehouse" tone="orange" size="sm" /> Reservas</h1>
      <AutonomyPanel />
      <div className="grid gap-2 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200 active:scale-[0.99]">
            <IconTile name={s.icon} tone={s.tone} size="md" />
            <span className="min-w-0 flex-1"><span className="block font-semibold">{s.title}</span><span className="block text-sm text-stone-500">{s.text}</span></span>
            <span className="text-xl text-stone-300">›</span>
          </Link>
        ))}
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { fmtNumber, homeSummary, kitSummary } from "@/lib/calc";
import { BRAND, SITE_URL } from "@/lib/config";
import { readiness, scoreLabel } from "@/lib/score";
import { mainKitItems, useHydrated, useStore } from "@/lib/store";
import { HouseholdChip } from "@/components/HouseholdChip";
import { Button, Card } from "@/components/ui";
import { Ring, Stepper } from "@/components/visual";
import { track } from "@/lib/track";
import { BackupCard } from "./BackupCard";
import { PaperCard } from "@/components/PaperCard";
import { AutonomyPanel } from "@/components/reserves/AutonomyPanel";
import { ThemeToggle } from "@/components/Theme";
import { Icon, IconTile } from "@/components/icons/Icon";

export function HomeView() {
  const hydrated = useHydrated();
  const s = useStore();
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;
  if (!s.household.onboarded) return <Onboarding />;

  const mainKit = mainKitItems(s.kit); // la mochila de casa es la que puntúa
  const { total, parts, next } = readiness(mainKit, s.pantry, s.plan, s.household, s.checkedEssentials);
  const lab = scoreLabel(total);
  const kit = kitSummary(mainKit, s.household);
  const home = homeSummary(mainKit, s.pantry, s.household);

  async function share() {
    const text = `Mi hogar está preparado al ${total}% para una emergencia. ¿Y el tuyo? Compruébalo gratis:`;
    const url = `${SITE_URL}/nota/${total}`; // página con tarjeta visual para WhatsApp/redes
    track("share_score", { score: total });
    if (navigator.share) await navigator.share({ title: BRAND.name, text, url }).catch(() => {});
    else await navigator.clipboard?.writeText(`${text} ${url}`);
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Tu hogar</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <HouseholdChip />
        </div>
      </div>

      <Card className="mb-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Ring pct={total} color={lab.stroke} size={160} stroke={16}>
          <span data-testid="score" className="text-4xl font-black tabular-nums" style={{ color: lab.stroke }}>{total}</span>
          <span className="text-xs text-stone-500">de 100</span>
        </Ring>
        <div className="flex-1">
          <div className="text-sm text-stone-500">Tu hogar está</div>
          <div className={`text-2xl font-bold ${lab.tone}`}>{lab.text}</div>
          {total < 100 && (
            <Link href={next.href} className="mt-3 flex items-center gap-3 rounded-2xl bg-brand-50 p-3 text-left ring-1 ring-brand-100">
              <IconTile name={next.icon} tone="orange" size="sm" className="bg-white" />
              <span className="text-sm"><b>Siguiente paso (+{next.max - next.points} pts):</b><br />{next.tip}</span>
            </Link>
          )}
          <button onClick={share} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-600">
            <Share2 className="h-4 w-4" /> Compartir mi nota
          </button>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <Card className="p-4">
          <IconTile name="backpack" tone="orange" size="sm" />
          <div className="mt-1 text-2xl font-bold tabular-nums">{fmtNumber(Math.floor(kit.autonomyHours))} h</div>
          <div className="text-xs text-stone-500">con la mochila</div>
        </Card>
        <Card className="p-4">
          <IconTile name="house" tone="sky" size="sm" />
          <div className="mt-1 text-2xl font-bold tabular-nums">{fmtNumber(home.days, 1)} días</div>
          <div className="text-xs text-stone-500">en casa (kit + despensa)</div>
        </Card>
      </div>

      <Card className="mb-4">
        <h2 className="mb-3 font-semibold">Tu nota, paso a paso</h2>
        <ul className="space-y-3">
          {parts.map((p) => (
            <li key={p.id}>
              <Link href={p.href} className="flex items-center gap-3">
                <IconTile name={p.icon} tone={p.points >= p.max ? "emerald" : "stone"} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{p.label}</span>
                    <span className="tabular-nums text-stone-500">{p.points}/{p.max}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(p.points / p.max) * 100}%` }} />
                  </div>
                  <div className="mt-0.5 truncate text-xs text-stone-500">{p.tip}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <AutonomyPanel compact />

      <Link href="/app/apagon"
        className="mb-4 flex items-center gap-4 rounded-3xl bg-stone-900 p-4 text-white shadow-sm active:scale-[0.99]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400"><Icon name="lightning" className="h-8 w-8" /></span>
        <div className="flex-1">
          <div className="font-semibold">Modo apagón</div>
          <div className="text-sm text-stone-300">Qué hacer ahora mismo, paso a paso</div>
        </div>
        <span className="text-2xl">›</span>
      </Link>

      <PaperCard />

      <BackupCard />

      <p className="mt-6 text-center text-[11px] text-stone-400">
        Valores orientativos. Sigue siempre a Protección Civil y al 112 ·{" "}
        <Link href="/aviso-legal" className="underline">Aviso legal</Link> ·{" "}
        <Link href="/privacidad" className="underline">Privacidad</Link>
      </p>
    </>
  );
}

/** Bienvenida: 3 preguntas y la app queda montada para tu hogar. */
function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const rows: [string, string, number, (n: number) => void, number][] = [
    ["user", "Adultos", adults, setAdults, 1],
    ["baby", "Niños", children, setChildren, 0],
    ["paw-print", "Mascotas", pets, setPets, 0],
  ];
  return (
    <div className="mx-auto max-w-md py-6 text-center">
      <IconTile name="shield-check" tone="orange" size="xl" className="mx-auto" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Prepara tu hogar en 2 minutos</h1>
      <p className="mt-2 text-stone-600">¿Cuántos sois en casa?</p>
      <Card className="mt-6 space-y-4 text-left">
        {rows.map(([e, l, v, set, min]) => (
          <div key={l} className="flex items-center justify-between">
            <span className="flex items-center gap-3 text-lg font-medium"><IconTile name={e} tone={e === "paw-print" ? "orange" : e === "baby" ? "sky" : "indigo"} size="md" />{l}</span>
            <Stepper label={l} min={min} value={v} onChange={set} />
          </div>
        ))}
      </Card>
      <Button className="mt-6 w-full py-4 text-base" onClick={() => complete({ adults, children, pets })}>
        Empezar →
      </Button>
      <p className="mt-3 text-xs text-stone-400">Sin registro. Tus datos se quedan en tu móvil.</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { BRAND } from "@/lib/config";
import { useHydrated, useStore } from "@/lib/store";
import { track } from "@/lib/track";
import { Button } from "@/components/ui";

/** Tarjetas imprimibles del plan familiar: tamaño cartera (85 × 55 mm, dos caras) y nevera (A6). Sin datos de salud. */
export function PlanCards() {
  const hydrated = useHydrated();
  const plan = useStore((s) => s.plan);
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;

  const name = plan.householdName || "Mi familia";
  const rows: [string, string][] = [
    ["Punto cerca de casa", plan.meetingPointNear],
    ["Punto fuera del barrio", plan.meetingPointFar],
    ["Contacto fuera de la ciudad", plan.outOfAreaContact],
  ];
  const members = plan.members.filter((m) => m.name || m.phone);
  const empty = !rows.some(([, v]) => v) && members.length === 0;
  const Line = ({ label, value, small }: { label: string; value: string; small?: boolean }) => (
    <div className={small ? "mt-[1.2mm]" : "mt-2"}>
      <div className={small ? "text-[5.5pt] font-bold uppercase tracking-wide text-stone-500" : "text-[8pt] font-bold uppercase tracking-wide text-stone-500"}>{label}</div>
      <div className={small ? "min-h-[3.2mm] border-b border-dotted border-stone-400 text-[7.5pt] leading-tight" : "min-h-5 border-b border-dotted border-stone-400 text-[11pt]"}>{value}</div>
    </div>
  );
  const Head = ({ small }: { small?: boolean }) => (
    <div className="flex items-center justify-between">
      <div>
        <div className={small ? "text-[5.5pt] font-bold uppercase tracking-widest text-brand-600" : "text-[9pt] font-bold uppercase tracking-widest text-brand-600"}>Plan de emergencia</div>
        <div className={small ? "text-[9pt] font-bold leading-tight" : "text-[16pt] font-bold"}>{name}</div>
      </div>
      <div className={small ? "rounded bg-red-600 px-1.5 py-0.5 text-center text-white" : "rounded-lg bg-red-600 px-3 py-1.5 text-center text-white"}>
        <div className={small ? "text-[11pt] font-black leading-none" : "text-[22pt] font-black leading-none"}>112</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/app/plan" className="text-sm text-stone-500">← Volver al plan</Link>
        <Button onClick={() => { track("print_plan_card"); window.print(); }}><Printer className="h-4 w-4" /> Imprimir o guardar PDF</Button>
      </div>
      {empty && (
        <p className="no-print mb-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Tu plan está vacío: <Link href="/app/plan" className="font-semibold underline">rellena los teléfonos y el punto de encuentro</Link> y vuelve aquí. También puedes imprimirlas en blanco y escribir a mano.
        </p>
      )}
      <p className="no-print mb-4 text-xs text-stone-500">Recorta por la línea de puntos. La tarjeta pequeña es del tamaño de una tarjeta bancaria: dóblala por la mitad y llévala en la cartera. No incluimos datos de salud por privacidad.</p>

      <div className="print-area flex flex-wrap items-start gap-6 print:gap-[8mm]">
        {/* Cartera: dos caras de 85,6 × 54 mm, una al lado de la otra para doblar */}
        <div className="flex border-2 border-dashed border-stone-400 bg-white" style={{ width: "171.2mm", height: "54mm" }}>
          <div className="h-full w-1/2 overflow-hidden border-r border-dashed border-stone-300 p-[3mm]">
            <Head small />
            {rows.map(([l, v]) => <Line key={l} label={l} value={v} small />)}
          </div>
          <div className="h-full w-1/2 overflow-hidden p-[3mm]">
            <div className="text-[5.5pt] font-bold uppercase tracking-widest text-brand-600">Teléfonos de la familia</div>
            <table className="mt-[1mm] w-full text-[7.5pt] leading-tight">
              <tbody>
                {(members.length ? members : Array.from({ length: 5 }, (_, i) => ({ id: String(i), name: "", phone: "" }))).slice(0, 6).map((m) => (
                  <tr key={m.id} className="border-b border-dotted border-stone-300"><td className="py-[0.6mm] pr-1 font-medium">{m.name}</td><td className="py-[0.6mm] text-right tabular-nums">{m.phone}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="mt-[1.5mm] text-[5.5pt] text-stone-500">Sin cobertura: manda SMS, gastan menos batería y entran antes. · {BRAND.name}</div>
          </div>
        </div>

        {/* Nevera: A6 (105 × 148 mm) */}
        <div className="border-2 border-dashed border-stone-400 bg-white p-[6mm]" style={{ width: "105mm", height: "148mm" }}>
          <Head />
          {rows.map(([l, v]) => <Line key={l} label={l} value={v} />)}
          <div className="mt-3 text-[8pt] font-bold uppercase tracking-wide text-stone-500">Familia</div>
          <table className="w-full text-[10pt]">
            <tbody>
              {(members.length ? members : Array.from({ length: 4 }, (_, i) => ({ id: String(i), name: "", phone: "" }))).slice(0, 7).map((m) => (
                <tr key={m.id} className="border-b border-dotted border-stone-300"><td className="py-1 pr-2 font-medium">{m.name}</td><td className="py-1 text-right tabular-nums">{m.phone}</td></tr>
              ))}
            </tbody>
          </table>
          <Line label="Documentos" value={plan.docsLocation} />
          <Line label="Llaves de luz, agua y gas" value={plan.utilitiesShutoff} />
          <div className="mt-3 text-center text-[7pt] text-stone-500">Hecho con {BRAND.name} · En caso de duda, llama al 112</div>
        </div>
      </div>
    </>
  );
}

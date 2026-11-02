"use client";

import { Plus, Printer, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { BRAND, SITE_URL } from "@/lib/config";
import { useHydrated, useStore } from "@/lib/store";
import { track } from "@/lib/track";
import type { FamilyPlan } from "@/lib/types";
import { Card, cn } from "@/components/ui";
import { Icon, IconTile } from "@/components/icons/Icon";

type PlanKey = keyof Omit<FamilyPlan, "members">;

const PRINT_ROWS: { key: PlanKey; label: string; icon: string }[] = [
  { key: "address", label: "Dirección", icon: "house-line" },
  { key: "meetingPointNear", label: "Encuentro cerca", icon: "map-pin" },
  { key: "meetingPointFar", label: "Encuentro lejos", icon: "map-trifold" },
  { key: "outOfAreaContact", label: "Contacto fuera", icon: "phone-call" },
  { key: "docsLocation", label: "Documentos", icon: "identification-card" },
  { key: "utilitiesShutoff", label: "Llaves agua/gas/luz", icon: "wrench" },
];

/** Campo grande con icono y ✓ cuando está relleno. */
function IconField({ icon, label, value, onChange, placeholder, chips }: {
  icon: string; label: string; value: string; onChange: (v: string) => void; placeholder: string; chips?: string[];
}) {
  return (
    <div>
      <label className="flex items-center gap-3">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", value ? "bg-emerald-50 text-emerald-600 ring-2 ring-emerald-400" : "bg-stone-100 text-stone-500")}>
          <Icon name={icon} className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-stone-500">{label} {value && <span className="text-emerald-600">✓</span>}</span>
          <input className="mt-0.5 w-full" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-label={label} />
        </span>
      </label>
      {chips && !value && (
        <div className="ml-14 mt-2 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <button key={c} type="button" onClick={() => onChange(c)} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs hover:bg-stone-200">{c}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PlanView() {
  const hydrated = useHydrated();
  const { plan, household, setPlan, addMember, updateMember, removeMember } = useStore();
  const [openNotes, setOpenNotes] = useState<string[]>([]);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;

  const set = (key: PlanKey) => (v: string) => setPlan({ [key]: v } as Partial<FamilyPlan>);
  const checks = [plan.meetingPointNear, plan.meetingPointFar, plan.outOfAreaContact, plan.docsLocation, plan.members.length ? "x" : ""];
  const done = checks.filter(Boolean).length;
  const people = household.adults + household.children;

  function createMembers() {
    const st = useStore.getState();
    for (let i = 0; i < people; i++) st.addMember();
    const ids = useStore.getState().plan.members.map((m) => m.id);
    ids.forEach((id, i) =>
      updateMember(id, { name: i < household.adults ? `Adulto ${i + 1}` : `Niño/a ${i - household.adults + 1}` }),
    );
  }

  async function share() {
    track("share_plan");
    const data = { title: BRAND.name, text: "Ya tenemos el plan de emergencia de la familia. Haz el tuyo gratis:", url: SITE_URL };
    if (navigator.share) await navigator.share(data).catch(() => {});
    else await navigator.clipboard?.writeText(`${data.text} ${data.url}`);
  }

  return (
    <>
      <div className="no-print">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight"><IconTile name="users-three" tone="violet" size="sm" /> Plan familiar</h1>
          <div className="flex gap-2">
            <button onClick={() => { track("print_plan"); window.print(); }} aria-label="Imprimir"
              className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm">
              <Printer className="h-4 w-4" /> Imprimir
            </button>
            <button onClick={share} aria-label="Compartir" className="rounded-full bg-white p-2 shadow-sm ring-1 ring-stone-200">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Card className="mb-4 p-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Plan completado</span>
            <span className="font-semibold tabular-nums text-brand-600" data-testid="plan-progress">{done}/5</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(done / 5) * 100}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-stone-500">Un plan acordado evita que nadie se pierda si cae la red. Lo imprimes y a la nevera.</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 print:block">
        <div className="no-print space-y-4">
          {/* Personas */}
          <Card>
            <h2 className="mb-3 flex items-center gap-2 font-semibold"><Icon name="users" className="h-5 w-5 text-violet-600" /> Quiénes sois</h2>
            {plan.members.length === 0 && people > 0 && (
              <button onClick={createMembers} className="mb-3 w-full rounded-2xl border-2 border-dashed border-orange-300 bg-brand-50 py-3 text-sm font-medium text-brand-700">
                <Icon name="sparkle" className="mr-1 inline h-4 w-4 align-[-2px]" /> Crear {people} ficha{people > 1 ? "s" : ""} para tu familia
              </button>
            )}
            <div className="space-y-2">
              {plan.members.map((m, i) => {
                const notes = openNotes.includes(m.id) || !!m.notes;
                return (
                  <div key={m.id} className="rounded-2xl bg-stone-50 p-3">
                    <div className="flex items-center gap-2">
                      <IconTile name={i < household.adults ? "user" : "baby"} tone={i < household.adults ? "indigo" : "sky"} size="sm" />
                      <input className="min-w-0 flex-1" placeholder="Nombre" value={m.name} onChange={(e) => updateMember(m.id, { name: e.target.value })} aria-label="Nombre" />
                      <button aria-label="Quitar persona" onClick={() => removeMember(m.id)} className="rounded-full p-1.5 text-stone-300 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2 pl-10">
                      <Icon name="phone-call" className="h-5 w-5 shrink-0 text-stone-400" />
                      <input className="min-w-0 flex-1" inputMode="tel" placeholder="Teléfono" value={m.phone} onChange={(e) => updateMember(m.id, { phone: e.target.value })} aria-label="Teléfono" />
                    </div>
                    {notes ? (
                      <div className="mt-2 flex items-center gap-2 pl-10">
                        <Icon name="pill" className="h-5 w-5 shrink-0 text-rose-500" />
                        <input className="min-w-0 flex-1" placeholder="Medicación, alergias…" value={m.notes} onChange={(e) => updateMember(m.id, { notes: e.target.value })} aria-label="Salud" />
                      </div>
                    ) : (
                      <button onClick={() => setOpenNotes([...openNotes, m.id])} className="mt-2 pl-10 text-xs font-medium text-brand-600">+ Medicación o alergias</button>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={addMember} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium text-stone-600 hover:bg-stone-100">
              <Plus className="h-4 w-4" /> Añadir persona
            </button>
          </Card>

          {/* Encuentro */}
          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 font-semibold"><Icon name="map-pin" className="h-5 w-5 text-violet-600" /> Dónde os encontráis</h2>
            <IconField icon="map-pin" label="Cerca de casa" value={plan.meetingPointNear} onChange={set("meetingPointNear")}
              placeholder="Si no podéis entrar en casa" chips={["Portal de casa", "Puerta del colegio", "Plaza del barrio"]} />
            <IconField icon="map-trifold" label="Fuera del barrio" value={plan.meetingPointFar} onChange={set("meetingPointFar")}
              placeholder="Si hay que salir de la zona" chips={["Casa de los abuelos", "Casa de familiares", "Ayuntamiento"]} />
            <IconField icon="phone-call" label="Contacto fuera de la ciudad" value={plan.outOfAreaContact} onChange={set("outOfAreaContact")}
              placeholder="Tía Ana · 600 000 000" />
          </Card>

          {/* Casa */}
          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 font-semibold"><Icon name="house" className="h-5 w-5 text-violet-600" /> Tu casa</h2>
            <IconField icon="house" label="Nombre del hogar" value={plan.householdName} onChange={set("householdName")} placeholder="Familia García" />
            <IconField icon="map-pin-line" label="Dirección" value={plan.address} onChange={set("address")} placeholder="C/ Mayor 1, 3ºB" />
            <IconField icon="identification-card" label="Dónde están los documentos" value={plan.docsLocation} onChange={set("docsLocation")}
              placeholder="Carpeta azul" chips={["Carpeta en el armario", "Cajón de la entrada", "Mochila de emergencia"]} />
            <IconField icon="wrench" label="Llaves de agua, gas y luz" value={plan.utilitiesShutoff} onChange={set("utilitiesShutoff")}
              placeholder="Agua: bajo el fregadero · Luz: entrada" />
            <IconField icon="note-pencil" label="Notas" value={plan.notes} onChange={set("notes")} placeholder="Mascotas, vecinos que necesitan ayuda…" />
          </Card>
        </div>

        {/* Vista imprimible */}
        <Card className="print-area self-start border-2 border-stone-900 lg:sticky lg:top-8">
          <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Plan de emergencia</div>
              <div className="text-xl font-bold">{plan.householdName || "Mi hogar"}</div>
            </div>
            <div className="rounded-lg bg-red-600 px-3 py-2 text-center text-white">
              <div className="text-[10px] font-semibold uppercase">Emergencias</div>
              <div className="text-2xl font-black leading-none">112</div>
            </div>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            {PRINT_ROWS.map((r) => (
              <div key={r.key} className="grid grid-cols-[150px_1fr] gap-2">
                <dt className="flex items-center gap-1 text-xs font-semibold uppercase text-stone-500"><Icon name={r.icon} className="h-4 w-4" /> {r.label}</dt>
                <dd className="min-h-5 border-b border-dotted border-stone-300">{plan[r.key]}</dd>
              </div>
            ))}
          </dl>
          {plan.members.length > 0 && (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-stone-500">
                  <th className="pb-1">Nombre</th><th className="pb-1">Teléfono</th><th className="pb-1">Salud</th>
                </tr>
              </thead>
              <tbody>
                {plan.members.map((m) => (
                  <tr key={m.id} className="border-t border-stone-200 align-top">
                    <td className="py-1 pr-2 font-medium">{m.name}</td>
                    <td className="py-1 pr-2 tabular-nums">{m.phone}</td>
                    <td className="py-1 text-xs">{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {plan.notes && <p className="mt-3 whitespace-pre-wrap text-sm">{plan.notes}</p>}
          <div className="mt-5 border-t border-stone-200 pt-2 text-center text-[11px] text-stone-500">
            {BRAND.footer} · Crea el tuyo gratis en {SITE_URL.replace(/^https?:\/\//, "")}
          </div>
        </Card>
      </div>
    </>
  );
}

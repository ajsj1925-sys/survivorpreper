"use client";

import Link from "next/link";
import { useState } from "react";
import { emergencyMenu, type MenuItem } from "@/lib/meals";
import { mainKitItems, useHydrated, useStore } from "@/lib/store";
import { Card, cn } from "@/components/ui";
import { Icon, IconTile } from "@/components/icons/Icon";

const fmtUnits = (m: MenuItem) => {
  const u = m.units;
  const n = u >= 1 ? u.toLocaleString("es-ES", { maximumFractionDigits: 1 }) : u >= 0.5 ? "½" : u >= 0.25 ? "¼" : "un poco de";
  // «1 lata de atún» y no «1 lata lata de atún»
  const unit = u < 0.25 || m.name.toLowerCase().startsWith(m.unit.toLowerCase()) ? "" : m.unit + (u > 1 && !m.unit.endsWith("s") ? (m.unit === "ud" || /[aeiou]$/.test(m.unit) ? "s" : "es") : "");
  return `${n} ${unit}`.trim();
};

export function MenuView() {
  const hydrated = useHydrated();
  const { kit, pantry, household } = useStore();
  const [noCook, setNoCook] = useState(false);
  const [shown, setShown] = useState(7);
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60" />;
  const m = emergencyMenu(mainKitItems(kit), pantry, household, { noCook });
  const total = m.days.length;
  const Items = ({ list }: { list: MenuItem[] }) => (
    <span>{list.map((i, k) => (
      <span key={i.id + k}>{k > 0 && " · "}<b className="font-medium">{fmtUnits(i)}</b> {i.name.toLowerCase()}{i.cook && <Icon name="fire" className="ml-0.5 inline h-3.5 w-3.5 text-orange-500" />}</span>
    ))}</span>
  );

  return (
    <>
      <Link href="/app/reservas" className="text-sm text-stone-500">← Reservas</Link>
      <h1 className="mb-4 mt-1 flex items-center gap-2.5 text-2xl font-bold tracking-tight"><IconTile name="chef-hat" tone="amber" size="sm" /> Menú de emergencia</h1>

      <Card className="mb-4">
        <div className="flex items-end gap-3">
          <div className="text-4xl font-black tabular-nums text-amber-600" data-testid="menu-days">{total}</div>
          <div className="pb-1 text-sm text-stone-600">días de comida con lo que tenéis · {m.kcalDay.toLocaleString("es-ES")} kcal/día</div>
        </div>
        <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Forma de cocinar">
          {[[false, "Con hornillo"], [true, "Sin cocinar"]].map(([v, l]) => (
            <button key={String(v)} role="radio" aria-checked={noCook === v} onClick={() => setNoCook(v as boolean)}
              className={cn("rounded-full px-3 py-1.5 text-sm font-medium ring-1", noCook === v ? "bg-stone-900 text-white ring-stone-900" : "bg-white ring-stone-200")}>{l as string}</button>
          ))}
        </div>
        {!noCook && !m.stove && <p className="mt-2 text-sm text-amber-700">No tienes hornillo y gas: el menú solo usa lo que se come sin cocinar. <Link href="/app/energia" className="underline">Añádelos</Link></p>}
        {m.skipped.length > 0 && <p className="mt-2 text-xs text-stone-500">Sin cocinar no se usan: {m.skipped.join(", ")}.</p>}
        {m.firstOut.length > 0 && (
          <p className="mt-2 text-sm text-stone-700">Lo primero que se acaba: <b>{m.firstOut[0].name}</b> (día {m.firstOut[0].day}). Se gasta antes lo que caduca antes.</p>
        )}
      </Card>

      {total === 0 ? (
        <Card className="py-10 text-center">
          <IconTile name="basket" tone="amber" size="xl" className="mx-auto" />
          <p className="mt-3 font-medium">Aún no hay comida suficiente para un día</p>
          <Link href="/app/despensa" className="text-sm text-brand-600">Añade comida a la despensa</Link>
        </Card>
      ) : (
        <ol className="space-y-2" data-testid="menu-list">
          {m.days.slice(0, shown).map((d) => (
            <li key={d.day} className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-stone-200">
              <div className="mb-1 flex justify-between font-semibold"><span>Día {d.day}</span><span className="text-xs font-normal text-stone-400">{Math.round(d.kcal).toLocaleString("es-ES")} kcal</span></div>
              {d.breakfast.length > 0 && <div><span className="text-xs font-semibold uppercase text-stone-400">Desayuno · </span><Items list={d.breakfast} /></div>}
              {d.main.length > 0 && <div className="mt-0.5"><span className="text-xs font-semibold uppercase text-stone-400">Comida y cena · </span><Items list={d.main} /></div>}
            </li>
          ))}
        </ol>
      )}
      {total > shown && <button onClick={() => setShown(total)} className="mt-3 w-full rounded-xl py-2 text-sm font-medium text-brand-600 hover:bg-brand-50">Ver los {total} días</button>}
      <p className="mt-3 text-[11px] text-stone-400">Reparto orientativo por calorías para toda la familia. Los bebés, las alergias y las dietas especiales necesitan su propio plan. <Icon name="fire" className="inline h-3 w-3 text-orange-500" /> = hay que cocinarlo.</p>
    </>
  );
}

"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { daysUntil, toISODate, today } from "@/lib/calc";
import { useHydrated, useStore } from "@/lib/store";
import { track } from "@/lib/track";
import { Icon } from "./icons/Icon";

interface Due {
  name: string;
  date: string;
  where: "kit" | "despensa";
}

/** Lo que caduca en los próximos 7 días (o ya caducó), de todas las mochilas y la despensa. */
function dueSoon(kit: { name: string; expiresAt: string | null }[], pantry: { name: string; expiresAt: string }[]): Due[] {
  const out: Due[] = [];
  for (const i of kit) if (i.expiresAt && daysUntil(i.expiresAt) <= 7) out.push({ name: i.name, date: i.expiresAt, where: "kit" });
  for (const l of pantry) if (daysUntil(l.expiresAt) <= 7) out.push({ name: l.name, date: l.expiresAt, where: "despensa" });
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Recordatorio sin servidor:
 * 1) al abrir la app, una vez al día, un aviso con lo que caduca esta semana;
 * 2) opcional: notificación del sistema aunque la app esté cerrada (Chrome Android con la app instalada,
 *    vía Periodic Background Sync; el service worker lee las fechas que guardamos aquí).
 */
export function ExpiryReminder() {
  const hydrated = useHydrated();
  const { kit, pantry, lastReminder, markReminded } = useStore();
  const due = useMemo(() => dueSoon(kit, pantry), [kit, pantry]);
  const [hidden, setHidden] = useState(false);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const todayIso = toISODate(today());

  // Copia mínima de fechas para que el service worker pueda avisar con la app cerrada
  useEffect(() => {
    if (!hydrated || typeof caches === "undefined") return;
    const data = [
      ...kit.filter((i) => i.expiresAt).map((i) => ({ name: i.name, date: i.expiresAt })),
      ...pantry.map((l) => ({ name: l.name, date: l.expiresAt })),
    ];
    caches.open("survivoros-data").then((c) => c.put("/__expiry.json", new Response(JSON.stringify(data)))).catch(() => {});
  }, [hydrated, kit, pantry]);

  if (!hydrated || hidden || due.length === 0 || lastReminder === todayIso) return null;

  const expired = due.filter((d) => daysUntil(d.date) < 0).length;
  const dismiss = () => {
    markReminded(todayIso);
    setHidden(true);
  };

  async function enableNotifications() {
    track("notifications_enable");
    if (!("Notification" in window)) return setNotifMsg("Tu navegador no permite avisos. Te recordaremos al abrir la app.");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return setNotifMsg("Sin permiso no podemos avisarte con la app cerrada.");
    const reg = (await navigator.serviceWorker?.ready) as ServiceWorkerRegistration & {
      periodicSync?: { register: (tag: string, o: { minInterval: number }) => Promise<void> };
    };
    try {
      if (reg?.periodicSync) {
        await reg.periodicSync.register("expiry-check", { minInterval: 24 * 60 * 60 * 1000 });
        setNotifMsg("Listo: te avisaremos una vez al día si algo caduca, aunque no abras la app.");
      } else {
        setNotifMsg("Tu móvil solo permite avisarte al abrir la app. Para avisos siempre, instálala desde Chrome en Android.");
      }
    } catch {
      setNotifMsg("Instala la app en tu pantalla de inicio para recibir avisos con la app cerrada.");
    }
  }

  return (
    <div role="status" className="anim-fade-up no-print mb-4 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200" data-testid="expiry-reminder">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 ring-1 ring-amber-200">
          <Icon name="bell-ringing" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-amber-900">
            {expired
              ? `${due.length} producto${due.length > 1 ? "s" : ""} caducado${due.length > 1 ? "s" : ""} o a punto de caducar`
              : `${due.length} producto${due.length > 1 ? "s caducan" : " caduca"} esta semana`}
          </div>
          <div className="mt-0.5 truncate text-sm text-amber-800">{due.slice(0, 4).map((d) => d.name).join(", ")}{due.length > 4 ? "…" : ""}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={due.some((d) => d.where === "despensa") ? "/app/despensa" : "/app/kit"} onClick={dismiss}
              className="rounded-full bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700">Ver</Link>
            <button onClick={enableNotifications} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-amber-800 ring-1 ring-amber-200">
              Avisarme en el móvil
            </button>
          </div>
          {notifMsg && <p className="mt-2 text-xs text-amber-800">{notifMsg}</p>}
        </div>
        <button onClick={dismiss} aria-label="Cerrar aviso" className="rounded-full p-1 text-amber-700 hover:bg-amber-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

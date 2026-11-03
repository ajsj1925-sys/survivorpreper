// Recordatorio de calendario (.ics): sin servidor ni email. El calendario del móvil se encarga de avisar.
import { BRAND, SITE_URL } from "./config";

const pad = (n: number) => String(n).padStart(2, "0");
const stamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

/** Evento que se repite cada 6 meses, el primero dentro de 6 meses a las 10:00 (hora local). */
export function reviewCalendarFile(from = new Date()): string {
  const first = new Date(from.getFullYear(), from.getMonth() + 6, Math.min(from.getDate(), 28), 10, 0, 0);
  const local = `${first.getFullYear()}${pad(first.getMonth() + 1)}${pad(first.getDate())}T100000`;
  const end = `${first.getFullYear()}${pad(first.getMonth() + 1)}${pad(first.getDate())}T103000`;
  const url = `${SITE_URL}/app/despensa`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${BRAND.name}//Revision kit//ES`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:revision-kit-${from.getTime()}@miplanb`,
    `DTSTAMP:${stamp(from)}`,
    `DTSTART:${local}`,
    `DTEND:${end}`,
    "RRULE:FREQ=MONTHLY;INTERVAL=6",
    `SUMMARY:Revisar el kit de emergencia (${BRAND.name})`,
    `DESCRIPTION:5 minutos: agua\\, pilas y powerbank\\, caducidades de la comida\\, medicinas y teléfonos del plan familiar.\\n${url}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Toca revisar el kit de emergencia",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}

export function downloadReviewCalendar() {
  const blob = new Blob([reviewCalendarFile()], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "revisar-kit-mi-plan-b.ics";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

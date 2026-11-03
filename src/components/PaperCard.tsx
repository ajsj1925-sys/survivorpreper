"use client";

import Link from "next/link";
import { useState } from "react";
import { downloadReviewCalendar } from "@/lib/ics";
import { track } from "@/lib/track";
import { Card } from "./ui";
import { Icon, IconTile } from "./icons/Icon";

/** «Llévalo fuera del móvil»: lista en PDF, recordatorio en el calendario y tarjeta del plan. */
export function PaperCard() {
  const [added, setAdded] = useState(false);
  const row = "flex items-center gap-3 rounded-2xl p-2 text-left hover:bg-stone-50 active:scale-[0.99]";
  return (
    <Card className="mb-4">
      <div className="mb-2 flex items-center gap-2 font-semibold"><Icon name="printer" className="h-5 w-5 text-brand-500" /> Llévalo fuera del móvil</div>
      <div className="grid gap-1 sm:grid-cols-3">
        <Link href="/app/imprimir" className={row} onClick={() => track("paper_open", { what: "pdf" })}>
          <IconTile name="file-pdf" tone="rose" size="sm" />
          <span><span className="block text-sm font-medium">Lista del kit en PDF</span><span className="block text-xs text-stone-500">Para imprimir y tachar</span></span>
        </Link>
        <button className={row} onClick={() => { downloadReviewCalendar(); setAdded(true); track("calendar_reminder", { from: "home" }); }}>
          <IconTile name="calendar-check" tone="sky" size="sm" />
          <span><span className="block text-sm font-medium">{added ? "✓ Recordatorio descargado" : "Recordatorio en el calendario"}</span>
            <span className="block text-xs text-stone-500">{added ? "Ábrelo para añadirlo" : "Cada 6 meses, sin email"}</span></span>
        </button>
        <Link href="/app/plan/tarjeta" className={row} onClick={() => track("paper_open", { what: "card" })}>
          <IconTile name="identification-badge" tone="violet" size="sm" />
          <span><span className="block text-sm font-medium">Tarjeta del plan</span><span className="block text-xs text-stone-500">Para la cartera y la nevera</span></span>
        </Link>
      </div>
    </Card>
  );
}

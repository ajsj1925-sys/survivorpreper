"use client";

import { useRef, useState } from "react";
import { BRAND } from "@/lib/config";
import { toISODate, today } from "@/lib/calc";
import { useStore, type BackupData } from "@/lib/store";
import { track } from "@/lib/track";
import { Card } from "@/components/ui";

/** Copia de seguridad gratis: todo vive en el navegador, así que dejamos sacarlo y volver a meterlo. */
export function BackupCard() {
  const importData = useStore((s) => s.importData);
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function exportFile() {
    const s = useStore.getState();
    const data = {
      app: BRAND.name,
      version: 2,
      exportedAt: new Date().toISOString(),
      data: { household: s.household, kit: s.kit, pantry: s.pantry, plan: s.plan, checkedEssentials: s.checkedEssentials } satisfies BackupData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `survivoros-copia-${toISODate(today())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    track("backup_export");
    setMsg("✓ Copia descargada. Guárdala en tu nube o envíatela por email.");
  }

  async function importFile(f: File) {
    try {
      const json = JSON.parse(await f.text());
      const d = json?.data as BackupData | undefined;
      if (json?.app !== BRAND.name || !d || !Array.isArray(d.kit) || !Array.isArray(d.pantry)) throw new Error("formato");
      if (!confirm("Esto sustituirá los datos actuales por los de la copia. ¿Seguir?")) return;
      importData(d);
      track("backup_import");
      setMsg(`✓ Copia restaurada: ${d.kit.length} cosas en el kit y ${d.pantry.length} lotes en la despensa.`);
    } catch {
      setMsg("⚠️ Ese archivo no es una copia válida de SurvivorOS.");
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="text-3xl">💾</span>
        <div className="flex-1">
          <div className="font-semibold">Copia de seguridad</div>
          <div className="text-xs text-stone-500">Tus datos solo están en este móvil. Guarda una copia por si cambias de móvil o borras el navegador.</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={exportFile} className="rounded-xl bg-stone-100 py-2.5 text-sm font-medium hover:bg-stone-200">⬇️ Exportar</button>
        <button onClick={() => file.current?.click()} className="rounded-xl bg-stone-100 py-2.5 text-sm font-medium hover:bg-stone-200">⬆️ Importar</button>
        <input ref={file} type="file" accept="application/json,.json" className="hidden" aria-label="Archivo de copia"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ""; }} />
      </div>
      {msg && <p className="mt-2 text-xs text-stone-600" role="status">{msg}</p>}
    </Card>
  );
}

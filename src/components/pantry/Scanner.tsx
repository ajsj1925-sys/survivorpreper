"use client";

import { useEffect, useRef, useState } from "react";
import { lookupBarcode } from "@/lib/barcode";
import { Button } from "@/components/ui";
import { Sheet } from "@/components/visual";
import type { DraftProduct } from "./AddLotSheet";

interface Detector {
  detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]>;
}

/** Escáner de código de barras: cámara si el navegador lo permite, y si no, escribir el número. */
export function Scanner({ open, onClose, onFound }: { open: boolean; onClose: () => void; onFound: (p: DraftProduct) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "camera" | "nocamera" | "searching" | "notfound">("idle");

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setCode("");
    let stream: MediaStream | null = null;
    let stop = false;
    const BD = (window as unknown as { BarcodeDetector?: new (o: object) => Detector }).BarcodeDetector;
    if (!BD || !navigator.mediaDevices?.getUserMedia) {
      setStatus("nocamera");
      return;
    }
    const detector = new BD({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(async (s) => {
        stream = s;
        if (!video.current) return;
        video.current.srcObject = s;
        await video.current.play();
        setStatus("camera");
        while (!stop && video.current) {
          const found = await detector.detect(video.current).catch(() => []);
          if (found[0]?.rawValue) {
            stop = true;
            search(found[0].rawValue);
            break;
          }
          await new Promise((r) => setTimeout(r, 300));
        }
      })
      .catch(() => setStatus("nocamera"));
    return () => {
      stop = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function search(c: string) {
    setCode(c);
    setStatus("searching");
    try {
      const p = await lookupBarcode(c);
      if (!p) return setStatus("notfound");
      onFound({ name: p.name, emoji: p.emoji, type: p.type, unit: "ud", kcal: p.kcal, waterL: 0, shelfDays: p.shelfDays, catalogId: p.catalogId, barcode: c });
    } catch {
      setStatus("notfound");
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="📷 Escanear código">
      <div className="space-y-4 pb-2">
        {status !== "nocamera" && (
          <div className="relative overflow-hidden rounded-2xl bg-stone-900">
            <video ref={video} playsInline muted className="aspect-[4/3] w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-red-500/80" />
          </div>
        )}
        {status === "nocamera" && (
          <p className="rounded-xl bg-stone-50 p-3 text-sm text-stone-600">
            Tu navegador no deja usar la cámara para leer códigos. Escribe los números de debajo del código de barras.
          </p>
        )}
        <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) search(code.trim()); }} className="flex gap-2">
          <input inputMode="numeric" placeholder="8410000000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="min-w-0 flex-1 text-lg tracking-widest" aria-label="Código de barras" />
          <Button type="submit" disabled={!code || status === "searching"}>Buscar</Button>
        </form>
        {status === "searching" && <p className="text-center text-sm text-stone-500">Buscando producto…</p>}
        {status === "notfound" && (
          <p className="text-center text-sm text-amber-700">No lo encontramos. Elígelo del catálogo con «Añadir».</p>
        )}
        <p className="text-center text-[11px] text-stone-400">Datos de Open Food Facts, base de datos pública y gratuita.</p>
      </div>
    </Sheet>
  );
}

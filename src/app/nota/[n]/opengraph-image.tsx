import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/config";
import { clampScore, scoreLabel } from "@/lib/score";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Nota de preparación ante emergencias";

// Next 15 pasa params como objeto (Next 16 como promesa): Promise.resolve vale para ambos
type Params = { n: string };

/** Tarjeta que aparece al compartir el enlace en WhatsApp, X, etc. (sin emojis: no dependen de fuentes externas). */
export default async function Image({ params }: { params: Params }) {
  const n = clampScore((await Promise.resolve(params)).n);
  const lab = scoreLabel(n);
  const r = 150;
  const c = 2 * Math.PI * r;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#fafaf9", padding: 70, fontFamily: "sans-serif" }}>
        <div style={{ position: "relative", width: 360, height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="360" height="360" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="180" cy="180" r={r} fill="none" stroke="#e7e5e4" strokeWidth="34" />
            <circle cx="180" cy="180" r={r} fill="none" stroke={lab.stroke} strokeWidth="34" strokeLinecap="round"
              strokeDasharray={`${c}`} strokeDashoffset={`${c - (n / 100) * c}`} />
          </svg>
          <div style={{ fontSize: 110, fontWeight: 900, color: lab.stroke }}>{`${n}%`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 70, flex: 1 }}>
          <div style={{ fontSize: 30, color: "#78716c", textTransform: "uppercase", letterSpacing: 4 }}>Mi hogar está</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: lab.stroke, marginTop: 8 }}>{lab.text}</div>
          <div style={{ fontSize: 40, color: "#1c1917", marginTop: 30 }}>para una emergencia. ¿Y el tuyo?</div>
          <div style={{ display: "flex", marginTop: 40, background: "#ea580c", color: "white", fontSize: 32, fontWeight: 700, padding: "16px 30px", borderRadius: 20, alignSelf: "flex-start" }}>
            {`Calcúlalo gratis en ${BRAND.name}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

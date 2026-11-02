import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BRAND.name}: prepara tu hogar para un apagón o una emergencia`;

/** Imagen por defecto al compartir la web. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#ea580c", padding: 80, color: "white", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", opacity: 0.85 }}>{BRAND.name}</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.1, marginTop: 20 }}>¿Cuántas horas aguantaría tu casa sin luz ni agua?</div>
        <div style={{ fontSize: 36, marginTop: 30, opacity: 0.9 }}>Kit 72 h · Despensa · Plan familiar · Gratis y sin registro</div>
      </div>
    ),
    size,
  );
}

import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} · Preparación ante emergencias`,
    short_name: BRAND.name,
    description: BRAND.tagline,
    start_url: "/app",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#ea580c",
    lang: "es",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

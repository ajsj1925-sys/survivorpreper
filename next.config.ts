import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin ESLint instalado en la Fase 1: que no bloquee el build
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        // El service worker debe poder controlar todo el sitio y no quedarse cacheado
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;

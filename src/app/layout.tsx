import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

// Tipografía de la app (se descarga al compilar y se sirve desde nuestro dominio: sin peticiones a Google)
const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
import { BRAND, SITE_URL } from "@/lib/config";
import { PaywallModal } from "@/components/Paywall";
import { SWRegister } from "@/components/SWRegister";
import { ThemeSync, themeInitScript } from "@/components/Theme";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} · Kit de emergencia 72 h, despensa y plan familiar`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Prepara tu hogar para un apagón o una emergencia: calcula tu kit de 72 horas, controla la caducidad de tu despensa y crea un plan familiar imprimible. Gratis y sin registro.",
  applicationName: BRAND.name,
  // Verificación de Google Search Console (no es secreto: es público en el HTML)
  verification: { google: "vbrAwKMVklF_QejCw65Leq41R8Sj7lLZD-0mVZOBqDI" },
  openGraph: { type: "website", locale: "es_ES", siteName: BRAND.name },
  appleWebApp: { capable: true, title: BRAND.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={font.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <PaywallModal />
        <SWRegister />
        <ThemeSync />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          // Estadísticas sin cookies (Umami Cloud, plan gratuito)
          <Script defer src="https://cloud.umami.is/script.js" data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}

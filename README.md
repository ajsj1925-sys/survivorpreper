# SurvivorOS

Web-app local-first de preparación ante emergencias: Kit 72 h, Despensa con semáforo de caducidad y Plan familiar imprimible.

## Arrancar en local
```bash
npm install
cp .env.example .env.local   # rellena lo que tengas; todo es opcional
npm run dev                  # http://localhost:3000
```

## Publicar (Netlify)
Netlify está conectado a este repositorio: **cada cambio que se sube a `main` se publica solo**.
Las variables se ponen en Netlify → Site configuration → Environment variables (nunca en el código).

## Variables
| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Dominio final (SEO, sitemap, pie del plan) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Enlace de pago del Pro. Sin él, el botón sale como "Próximamente" |
| `NEXT_PUBLIC_AMAZON_TAG` | Tu tag de Amazon Afiliados (`xxxx-21`) |
| `BREVO_API_KEY`, `BREVO_LIST_ID` | Lista de emails. Sin ellas, el email se guarda solo en el navegador |
| `BREVO_WAITLIST_LIST_ID` | (Opcional) lista aparte para la lista de espera de Pro |
| `NEXT_PUBLIC_PRO_LIVE` | Vacío = Pro como lista de espera. `1` solo cuando exista el cobro real |
| `NEXT_PUBLIC_LEGAL_*` | **Obligatorio antes de publicar**: tu nombre, NIF, dirección y email para el aviso legal |

## Estructura
```
src/
  app/
    page.tsx                      Landing (SEO + captura de email + precios)
    guias/…                       Páginas SEO con mini-calculadora
    app/{kit,despensa,plan}       Panel privado (noindex)
    api/subscribe/route.ts        Email → Brevo
    sitemap.ts robots.ts manifest.ts
  components/                     UI, Sidebar, Paywall, EmailCapture, vistas de cada módulo
  lib/
    store.ts                      Zustand + persist (localStorage)
    calc.ts                       Cálculos puros (autonomía, caducidades)
    essentials.ts                 Checklist 72 h + búsquedas de afiliado
    config.ts                     Marca, precio, enlaces: todo el negocio en un solo archivo
public/sw.js                      Service worker (funciona sin conexión)
```

## Antes de publicar (checklist)
- [ ] Rellenar `NEXT_PUBLIC_LEGAL_*` (aviso legal y privacidad muestran [corchetes] mientras no lo hagas). Son plantillas: revísalas con un profesional si tienes dudas.
- [ ] Crear una web en cloud.umami.is (gratis, sin cookies) y poner su ID en `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Eventos que se miden: `email_signup`, `pro_interest`, `share_score`, `share_plan`, `print_plan`, `backup_export`.
- [ ] Probar en tu móvil: instalar, modo avión, escáner.
- [ ] Darte de alta en Amazon Afiliados y poner `NEXT_PUBLIC_AMAZON_TAG`.

## Importante antes de cobrar
El Pro de la Fase 1 es una maqueta: un Payment Link no le dice a la app quién ha pagado. Antes de vender funciones Pro de verdad, hace falta la Fase 2 (login + webhook de Stripe). Detalles en `PROMPT.md`.

# Prompt maestro · SurvivorOS (v2)

Actúa como ingeniero Full-Stack experto en Next.js (App Router), React, Tailwind CSS y SEO. Estás construyendo **SurvivorOS**, una web-app de **preparación familiar ante emergencias** (apagones, cortes de suministro, catástrofes) para el mercado hispanohablante, empezando por España.

## Objetivo de negocio
Atraer tráfico orgánico y convertirlo en ingresos recurrentes:
1. **Captación:** páginas SEO públicas, cada una con una mini-herramienta útil, y un plan familiar imprimible con marca que se comparte solo.
2. **Retención:** capturar el email desde el primer día (recordatorio para revisar el kit cada 6 meses).
3. **Ingresos:** enlaces de afiliado de Amazon en lo que le falta al usuario, y un plan Pro con lo que de verdad necesita servidor (avisos de caducidad, sincronización, varios hogares).

## Restricciones técnicas
- Next.js App Router + Tailwind v4 + Zustand con `persist` (localStorage) + lucide-react. Despliegue en Vercel.
- **Local-first**: los datos del usuario viven en su dispositivo. Única pieza de servidor en la Fase 1: `/api/subscribe` (reenvía el email a Brevo).
- **PWA instalable y que funcione sin conexión** (service worker). En un apagón no hay internet.
- Se guardan **fechas de caducidad** (yyyy-mm-dd), nunca "días hasta".
- Los cálculos van por persona y son configurables: kcal/día de adulto y de niño, y litros de agua por persona y día (3 L por defecto).
- El panel `/app/*` no se indexa; el SEO va en `/` y `/guias/*`.
- Todo el texto en español de España.

## Fase 1 (hecha)
- **Kit 72 h:** ítems con peso, kcal, litros de agua y caducidad. Panel con la autonomía en horas (el mínimo entre comida y agua), comida en días, agua en días, peso por adulto y alertas de caducados. Botones de añadido rápido. Checklist de 14 esenciales con enlace de afiliado a lo que falta.
- **Despensa:** lotes en tabla ordenada por caducidad, con semáforo: caducado, rojo (<30 días), amarillo (<6 meses), verde.
- **Plan familiar:** formulario y una hoja imprimible con el 112 y la marca en el pie. Botón de compartir.
- **Paywall:** botones con candado que abren un modal "Desbloquea SurvivorOS Pro por 9€" con el Stripe Payment Link.
- Landing, 2 guías SEO (kit 72 h y agua), sitemap, robots, manifest y JSON-LD.

## Fase 1.5 (hecha) · Más visual, menos formularios
- **Catálogo de ~70 productos** con emoji y valores medios (kcal, peso, agua, caducidad típica). Tocar = +1; buscador sin tildes; categorías; los más habituales primero.
- **Kit 72 h**: anillo de autonomía, barras de comida/agua/peso, imprescindibles como insignias, **kit recomendado** calculado para el hogar ("Lo tengo todo" o ajustar con +/−).
- **Despensa**: añadir en 2 toques con caducidad estimada (chips 1 mes…2 años), tarjetas agrupadas Consumir ya / Pronto / Bien con barra de vida, botones Consumido y Repuesto, **escáner de código de barras** (BarcodeDetector + Open Food Facts; si no hay cámara, se escribe el número). La despensa cuenta para la autonomía de la casa.
- **Inicio** con **nota de preparación 0–100** (kit, imprescindibles, reservas, caducados, plan), siguiente paso y botón de compartir.
- **Bienvenida** de 3 preguntas (adultos, niños, mascotas). Mascotas en el cálculo de agua y en el kit.
- **Lista de la compra automática** (lo que falta + lo que caduca) con afiliados y "Ya lo tengo".
- **Modo apagón**: 9 pasos grandes con iconos, 112 a un toque, días de comida/agua y vuestro punto de encuentro. Funciona sin conexión.

## Fase 1.6 (hecha) · Pulido y contenido
- Iconos Phosphor duotono (MIT) en baldosas de color por categoría; fuente Plus Jakarta Sans; logo propio (escudo con casa).
- Modo oscuro (automático/claro/oscuro), animaciones, recordatorios de caducidad (aviso al abrir + notificación con la app cerrada en Android), varias mochilas (2 gratis).
- Legal (aviso legal, privacidad, consentimiento RGPD), Pro como lista de espera, estadísticas Umami sin cookies, copia de seguridad, compartir nota con tarjeta visual.
- Despliegue: GitHub (ajsj1925-sys/survivorpreper) + Netlify; cada push a main se publica.
- 8 guías SEO en /guias con fuentes oficiales: kit 72 h, agua, apagón, coche (V16), bebés, mascotas, botiquín, comida (con calculadora).

## Fase 2 (siguiente)
- Login sin contraseña (enlace mágico) con Supabase y webhook de Stripe para marcar `isPro` en el servidor.
- Avisos de caducidad por email (cron diario de Vercel y Brevo).
- Sincronización del estado local con Supabase solo para usuarios Pro.
- Más páginas SEO: una por comunidad autónoma con sus riesgos (inundaciones, incendios, nevadas) y teléfonos.

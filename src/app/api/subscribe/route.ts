import { NextResponse } from "next/server";
import { BREVO_LISTS } from "@/lib/config";

// Única pieza de servidor de la Fase 1: reenvía el email a Brevo (servidor UE, plan gratuito).
// La clave SOLO vive en las variables de Netlify (nunca en el código: el repositorio es público).
export const dynamic = "force-dynamic";

const BREVO = "https://api.brevo.com/v3";

function listIdFor(source?: string) {
  return Number(
    source === "pro-waitlist"
      ? process.env.BREVO_WAITLIST_LIST_ID || BREVO_LISTS.waitlist
      : process.env.BREVO_LIST_ID || BREVO_LISTS.reminders,
  );
}

/** Pistas sobre la clave SIN mostrarla: prefijo, longitud y espacios. */
function keyFormat(key: string) {
  const hints: string[] = [];
  if (key !== key.trim()) hints.push("tiene espacios o saltos de línea al principio o al final");
  if (/^["']|["']$/.test(key.trim())) hints.push("lleva comillas: quítalas");
  const k = key.trim();
  if (k.startsWith("xsmtpsib-")) hints.push("es una clave SMTP, no una clave API: genera una en la pestaña Claves API");
  else if (!k.startsWith("xkeysib-")) hints.push("no empieza por xkeysib- (las claves API de Brevo empiezan así)");
  hints.push(`longitud ${k.length} caracteres (una clave completa suele tener unos 89)`);
  return hints.join("; ");
}

/** Traduce el error de Brevo a algo que se entienda. */
function explain(status: number, message: string) {
  if (status === 401) {
    if (/ip/i.test(message)) return "Brevo bloquea la IP del servidor: desactiva el bloqueo en Brevo → Seguridad → IP autorizadas.";
    return "Brevo no acepta la clave API: revisa BREVO_API_KEY en Netlify (copiada entera, sin espacios) y vuelve a publicar.";
  }
  if (status === 404) return "No existe esa lista en Brevo: revisa los números de lista.";
  if (status === 400 && /list/i.test(message)) return "Problema con la lista de Brevo: revisa los números de lista.";
  return `Brevo ha respondido ${status}: ${message}`;
}

async function brevoMessage(res: Response) {
  try {
    const j = await res.json();
    return String(j.message ?? j.code ?? "");
  } catch {
    return "";
  }
}

/**
 * Diagnóstico: abre /api/subscribe en el navegador para ver si la conexión con Brevo funciona.
 * No muestra la clave ni datos de la cuenta; solo si funciona y qué falla.
 */
export async function GET() {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: false,
      problema: "Netlify no tiene la variable BREVO_API_KEY (o la web no se ha vuelto a publicar desde que la añadiste).",
    });
  }
  const account = await fetch(`${BREVO}/account`, { headers: { "api-key": key.trim(), accept: "application/json" }, cache: "no-store" });
  if (!account.ok) {
    const raw = await brevoMessage(account);
    return NextResponse.json({
      ok: false,
      paso: "clave",
      problema: explain(account.status, raw),
      respuestaDeBrevo: raw || `(código ${account.status})`,
      formatoDeLaClave: keyFormat(key),
    });
  }
  const lists: Record<string, string> = {};
  for (const [name, id] of Object.entries({ recordatorios: listIdFor(), listaDeEspera: listIdFor("pro-waitlist") })) {
    const r = await fetch(`${BREVO}/contacts/lists/${id}`, { headers: { "api-key": key.trim(), accept: "application/json" }, cache: "no-store" });
    lists[name] = r.ok ? `OK (lista ${id}: «${(await r.json()).name}»)` : `Falla la lista ${id}: ${explain(r.status, await brevoMessage(r))}`;
  }
  const allOk = Object.values(lists).every((v) => v.startsWith("OK"));
  return NextResponse.json({ ok: allOk, clave: "Correcta", listas: lists });
}

export async function POST(req: Request) {
  let body: { email?: string; source?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "email", message: "Ese email no parece válido." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "consent", message: "Falta aceptar la política de privacidad." }, { status: 400 });
  }

  const key = process.env.BREVO_API_KEY;
  const listId = listIdFor(body.source);
  if (!key || !listId) return NextResponse.json({ ok: false, error: "not-configured" });

  const res = await fetch(`${BREVO}/contacts`, {
    method: "POST",
    headers: { "api-key": key.trim(), "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    cache: "no-store",
  });

  if (res.ok) return NextResponse.json({ ok: true });
  const message = explain(res.status, await brevoMessage(res));
  console.error("[subscribe] Brevo", res.status, message); // aparece en Netlify → Logs → Functions
  return NextResponse.json({ ok: false, error: "brevo", message }, { status: 502 });
}

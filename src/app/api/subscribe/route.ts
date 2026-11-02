import { NextResponse } from "next/server";

// Única pieza de servidor de la Fase 1: reenvía el email a Brevo (servidor UE, plan gratuito).
// Sin BREVO_API_KEY responde ok:false y el cliente lo guarda solo en local.
export async function POST(req: Request) {
  let body: { email?: string; source?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  }

  if (body.consent !== true) return NextResponse.json({ ok: false, error: "consent" }, { status: 400 });

  const key = process.env.BREVO_API_KEY;
  // La lista de espera de Pro puede ir a otra lista para medirla aparte
  const waitlist = body.source === "pro-waitlist" && process.env.BREVO_WAITLIST_LIST_ID;
  const listId = Number(waitlist ? process.env.BREVO_WAITLIST_LIST_ID : process.env.BREVO_LIST_ID);
  if (!key || !listId) return NextResponse.json({ ok: false, error: "not-configured" });

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
}

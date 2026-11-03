const { chromium } = require("playwright");
const fs = require("fs");
const iso = (d) => { const t = new Date(); t.setDate(t.getDate() + d); return t.toLocaleDateString("sv-SE"); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  // Dedo animado (coordenadas en px reales; la página tiene zoom 2.5)
  await p.addInitScript(() => {
    window.addEventListener("DOMContentLoaded", () => {
      const f = document.createElement("div"); f.id = "finger";
      f.style.cssText = "position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.55);border:3px solid rgba(28,25,23,.55);box-shadow:0 6px 18px rgba(0,0,0,.35);z-index:2147483647;pointer-events:none;transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .3s;opacity:0;transform:translate(216px,600px)";
      document.documentElement.appendChild(f);
      window.__moveFinger = (x, y) => { f.style.opacity = "1"; f.style.transform = `translate(${x}px,${y}px) scale(1)`; };
      window.__press = () => { f.animate([{ scale: 1 }, { scale: 0.75 }, { scale: 1 }], { duration: 260 });
        const r = document.createElement("div"); const t = f.style.transform;
        r.style.cssText = `position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:4px solid rgba(234,88,12,.9);z-index:2147483646;pointer-events:none;transform:${t}`;
        document.documentElement.appendChild(r); r.animate([{ scale: 1, opacity: 1 }, { scale: 2.4, opacity: 0 }], { duration: 520 }).onfinish = () => r.remove(); };
      window.__hideFinger = () => { f.style.opacity = "0"; };
    });
  });
  fs.rmSync("/home/claude/tutorial/sc", { recursive: true, force: true }); fs.mkdirSync("/home/claude/tutorial/sc");
  const cdp = await ctx.newCDPSession(p); const frames = [];
  cdp.on("Page.screencastFrame", async (f) => { const n = frames.length; fs.writeFileSync(`/home/claude/tutorial/sc/${String(n).padStart(5, "0")}.jpg`, Buffer.from(f.data, "base64")); frames.push(f.metadata.timestamp); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  const wait = (ms) => p.waitForTimeout(ms);
  const ev = []; const E = (n) => ev.push([n, Date.now() / 1000]);
  const tap = async (l, label = "tap") => {
    const loc = l.locator("visible=true").first(); await loc.scrollIntoViewIfNeeded(); await wait(100);
    const bb = await loc.boundingBox(); // en CSS px de la página con zoom → coordenadas de pantalla
    const z = 2.5; const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
    await p.evaluate(([x, y]) => window.__moveFinger(x, y), [cx / z, cy / z]);
    await wait(620); await p.evaluate(() => window.__press()); E(label);
    try { await loc.click({ timeout: 2000 }); } catch { await loc.evaluate((e) => e.click()); }
  };
  const type = async (l, text) => { await tap(l); await l.locator("visible=true").first().pressSequentially(text, { delay: 110 }); };
  const home = async () => { await tap(p.getByRole("link", { name: "Inicio" }).last()); await p.evaluate(() => window.scrollTo(0, 0)); await wait(100); await p.evaluate(() => window.scrollTo(0, 0)); };
  const hide = () => p.evaluate(() => window.__hideFinger());
  await p.goto("http://localhost:4322/app"); await wait(500); E("s1"); await wait(1500);
  await tap(p.getByRole("button", { name: "Más Niños" })); await wait(900);
  await tap(p.getByRole("button", { name: "Más Mascotas" })); await wait(900);
  await tap(p.getByRole("button", { name: /Empezar/ })); await hide(); await wait(200); E("s2"); await wait(3800);
  await tap(p.getByRole("link", { name: "Kit 72 h" }).last()); await wait(200); E("s3"); await wait(1200);
  for (let i = 0; i < 2; i++) { await tap(p.getByRole("button", { name: "Añadir Agua 1,5 L" })); await wait(350); }
  for (let i = 0; i < 2; i++) { await tap(p.getByRole("button", { name: "Añadir Ración de emergencia" })); await wait(350); }
  await type(p.getByLabel("Buscar producto"), "atún"); await wait(700);
  await tap(p.getByRole("button", { name: "Añadir Lata de atún" })); await wait(500);
  await tap(p.getByRole("button", { name: "Añadir Lata de atún" })); await wait(700);
  await p.getByLabel("Buscar producto").fill(""); await wait(300);
  await p.evaluate(() => window.scrollTo(0, 0)); await wait(400);
  await tap(p.getByRole("button", { name: /Kit recomendado/ })); await wait(200); E("s4"); await wait(2400);
  await tap(p.getByRole("button", { name: "Lo tengo todo" }), "ding"); await wait(1600);
  await tap(p.getByRole("button", { name: "Cerrar" })); await wait(400);
  await home(); await hide(); E("s5"); E("ding"); await wait(3800);
  await tap(p.getByRole("link", { name: "Despensa" }).last()); await wait(200); E("s6"); await wait(1000);
  await tap(p.getByRole("button", { name: "Añadir", exact: true })); await wait(700);
  await tap(p.getByRole("button", { name: "Añadir Leche UHT 1 L" })); await wait(900);
  await p.getByLabel("Fecha exacta").fill(iso(4)); await wait(500);
  await tap(p.getByRole("button", { name: "Guardar en la despensa" })); await hide(); await wait(3000);
  await tap(p.getByRole("link", { name: "Compra" }).last()); await p.evaluate(() => window.scrollTo(0, 0)); await hide(); await wait(200); E("s7"); await wait(3600);
  await tap(p.getByRole("link", { name: "Plan" }).last()); await p.evaluate(() => window.scrollTo(0, 0)); await wait(200); E("s8"); await wait(1000);
  await tap(p.getByRole("button", { name: /Crear \d+ fichas/ })); await wait(800);
  await type(p.getByLabel("Nombre", { exact: true }), "Lucía"); await wait(400);
  await type(p.getByLabel("Teléfono"), "600 123 456"); await wait(500);
  await tap(p.getByRole("button", { name: "Portal de casa" })); await wait(700);
  await type(p.getByLabel("Contacto fuera de la ciudad"), "Tía Ana"); await hide(); await wait(1800);
  await home(); await wait(500);
  await tap(p.getByRole("link", { name: /Modo apagón/ })); await p.evaluate(() => window.scrollTo(0, 0)); await hide(); E("s9"); await wait(4200); E("end");
  await cdp.send("Page.stopScreencast");
  let txt = ""; for (let i = 0; i < frames.length; i++) { const d = i + 1 < frames.length ? frames[i + 1] - frames[i] : 0.8; txt += `file 'sc/${String(i).padStart(5, "0")}.jpg'\nduration ${d.toFixed(4)}\n`; }
  txt += `file 'sc/${String(frames.length - 1).padStart(5, "0")}.jpg'\n`; fs.writeFileSync("/home/claude/tutorial/sc.txt", txt);
  fs.writeFileSync("/home/claude/tutorial/ev.json", JSON.stringify(ev.map(([n, t]) => [n, +(t - frames[0]).toFixed(3)])));
  console.log("frames", frames.length, "dur", (frames.at(-1) - frames[0]).toFixed(2));
  await b.close();
})();

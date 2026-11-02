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
  fs.rmSync("/home/claude/video1/sc2", { recursive: true, force: true }); fs.mkdirSync("/home/claude/video1/sc2");
  const cdp = await ctx.newCDPSession(p); const frames = [];
  cdp.on("Page.screencastFrame", async (f) => { const n = frames.length; fs.writeFileSync(`/home/claude/video1/sc2/${String(n).padStart(5, "0")}.jpg`, Buffer.from(f.data, "base64")); frames.push(f.metadata.timestamp); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
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
  await p.goto("http://localhost:4322/app"); await wait(500); E("start"); await wait(1200);
  await tap(p.getByRole("button", { name: "Más Niños" })); await wait(900);
  await tap(p.getByRole("button", { name: /Empezar/ })); await p.evaluate(() => window.__hideFinger()); await wait(200); E("home1"); await wait(3300);
  await tap(p.getByRole("link", { name: "Kit 72 h" }).last()); await wait(300); E("kit"); await wait(900);
  for (let i = 0; i < 3; i++) { await tap(p.getByRole("button", { name: "Añadir Agua 1,5 L" })); await wait(250); }
  for (let i = 0; i < 2; i++) { await tap(p.getByRole("button", { name: "Añadir Lata de atún" })); await wait(250); }
  await tap(p.getByRole("button", { name: "Añadir Linterna frontal" })); await wait(700);
  await tap(p.getByRole("button", { name: /Kit recomendado/ })); await wait(300); E("sheet"); await wait(1600);
  await tap(p.getByRole("button", { name: "Lo tengo todo" }), "ding"); await wait(1500);
  await tap(p.getByRole("button", { name: "Cerrar" })); await wait(500);
  await tap(p.getByRole("link", { name: "Inicio" }).last()); await p.evaluate(() => { window.scrollTo(0, 0); window.__hideFinger(); }); await wait(120); await p.evaluate(() => window.scrollTo(0, 0)); E("home2"); E("ding"); await wait(3600);
  // Despensa: añadir leche que caduca pronto
  await tap(p.getByRole("link", { name: "Despensa" }).last()); await wait(300); E("pantry"); await wait(700);
  await tap(p.getByRole("button", { name: "Añadir", exact: true })); await wait(600);
  await tap(p.getByRole("button", { name: "Añadir Leche UHT 1 L" })); await wait(700);
  await p.getByLabel("Fecha exacta").fill(iso(4)); await wait(400);
  await tap(p.getByRole("button", { name: "Guardar en la despensa" })); await p.evaluate(() => window.__hideFinger()); await wait(2600);
  // Modo apagón
  await tap(p.getByRole("link", { name: "Inicio" }).last()); await p.evaluate(() => window.scrollTo(0, 0)); await wait(500);
  await tap(p.getByRole("link", { name: /Modo apagón/ })); await p.evaluate(() => { window.scrollTo(0, 0); window.__hideFinger(); }); E("blackout"); await wait(3400); E("end");
  await cdp.send("Page.stopScreencast");
  let txt = ""; for (let i = 0; i < frames.length; i++) { const d = i + 1 < frames.length ? frames[i + 1] - frames[i] : 0.8; txt += `file 'sc2/${String(i).padStart(5, "0")}.jpg'\nduration ${d.toFixed(4)}\n`; }
  txt += `file 'sc2/${String(frames.length - 1).padStart(5, "0")}.jpg'\n`; fs.writeFileSync("/home/claude/video1/sc2.txt", txt);
  fs.writeFileSync("/home/claude/video1/ev.json", JSON.stringify(ev.map(([n, t]) => [n, +(t - frames[0]).toFixed(3)])));
  console.log("frames", frames.length, "dur", (frames.at(-1) - frames[0]).toFixed(2));
  await b.close();
})();

const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const fs = require("fs"); fs.rmSync("/home/claude/video1/sc", { recursive: true, force: true }); fs.mkdirSync("/home/claude/video1/sc");
  const cdp = await ctx.newCDPSession(p); const frames = [];
  cdp.on("Page.screencastFrame", async (f) => { const n = frames.length; fs.writeFileSync(`/home/claude/video1/sc/${String(n).padStart(5, "0")}.jpg`, Buffer.from(f.data, "base64")); frames.push(f.metadata.timestamp); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  // Indicador de toque visible
  await p.addInitScript(() => {
    document.addEventListener("pointerdown", (e) => {
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(234,88,12,.35);border:3px solid rgba(234,88,12,.9);z-index:99999;pointer-events:none;transition:transform .45s,opacity .45s`;
      document.body.appendChild(d);
      requestAnimationFrame(() => { d.style.transform = "scale(1.6)"; d.style.opacity = "0"; });
      setTimeout(() => d.remove(), 500);
    }, true);
  });
  const wait = (ms) => p.waitForTimeout(ms);
  const tap = async (l) => { const loc = l.locator("visible=true").first(); await loc.scrollIntoViewIfNeeded(); await wait(120); try { await loc.click({ timeout: 2000 }); } catch { await loc.evaluate((e) => e.click()); } };
  const t0 = Date.now(); const mark = (n) => console.log(n, ((Date.now() - t0) / 1000).toFixed(2));
  await p.goto("http://localhost:4322/app"); await wait(1200); mark("onboarding");
  await tap(p.getByRole("button", { name: "Más Niños" })); await wait(500);
  await tap(p.getByRole("button", { name: /Empezar/ })); await wait(2200); mark("nota-baja");
  await tap(p.getByRole("link", { name: "Kit 72 h" }).last()); await wait(900); mark("kit");
  for (let i = 0; i < 3; i++) { await tap(p.getByRole("button", { name: "Añadir Agua 1,5 L" })); await wait(250); }
  for (let i = 0; i < 2; i++) { await tap(p.getByRole("button", { name: "Añadir Ración de emergencia" })); await wait(250); }
  await wait(400);
  await tap(p.getByRole("button", { name: /Kit recomendado/ })); await wait(900);
  await tap(p.getByRole("button", { name: "Lo tengo todo" })); await wait(600);
  await tap(p.getByRole("button", { name: "Cerrar" })); await wait(900); mark("kit-lleno");
  await tap(p.getByRole("link", { name: "Inicio" }).last()); await p.evaluate(() => window.scrollTo(0, 0)); await wait(150); await p.evaluate(() => window.scrollTo(0, 0)); await wait(2600); mark("nota-alta");
  await cdp.send("Page.stopScreencast");
  let txt = ""; for (let i = 0; i < frames.length; i++) { const d = i + 1 < frames.length ? frames[i + 1] - frames[i] : 2.5; txt += `file 'sc/${String(i).padStart(5, "0")}.jpg'\nduration ${d.toFixed(4)}\n`; }
  txt += `file 'sc/${String(frames.length - 1).padStart(5, "0")}.jpg'\n`; fs.writeFileSync("/home/claude/video1/sc.txt", txt);
  console.log("frames", frames.length, "dur", (frames.at(-1) - frames[0]).toFixed(2));
  await ctx.close(); await b.close();
})();

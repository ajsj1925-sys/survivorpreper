// Service worker de Mi Plan B (las claves internas siguen siendo "survivoros-*" para no perder datos): la app tiene que abrir aunque no haya red (apagón, sin datos).
const VERSION = "v4";
const CACHE = `survivoros-${VERSION}`;
const PRECACHE = ["/app", "/app/kit", "/app/despensa", "/app/reservas", "/app/compra", "/app/plan", "/app/apagon", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== "survivoros-data").map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  // En local no se usa caché: siempre la versión más nueva
  if (self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1") return;
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  // Estáticos con hash: primero caché
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Páginas y datos RSC: primero red, si falla, lo último guardado
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("/app") : undefined)),
      ),
  );
});

// Aviso diario de caducidades con la app cerrada (Periodic Background Sync, Chrome Android con la app instalada).
// Las fechas las guarda la propia app en la caché "survivoros-data"; no hay servidor.
self.addEventListener("periodicsync", (event) => {
  if (event.tag !== "expiry-check") return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open("survivoros-data");
      const res = await cache.match("/__expiry.json");
      if (!res) return;
      const items = await res.json();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const soon = items.filter((i) => {
        const [y, m, d] = String(i.date).split("-").map(Number);
        return (new Date(y, m - 1, d).getTime() - today) / 86400000 <= 7;
      });
      if (!soon.length) return;
      await self.registration.showNotification(`${soon.length} cosa${soon.length > 1 ? "s" : ""} caduca${soon.length > 1 ? "n" : ""} esta semana`, {
        body: soon.slice(0, 3).map((i) => i.name).join(", ") + (soon.length > 3 ? "…" : ""),
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: "expiry",
      });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/app/despensa"));
});

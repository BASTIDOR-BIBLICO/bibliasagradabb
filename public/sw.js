// Service Worker — Bíblia Sagrada BB
// Suporte offline completo: shell + assets + dados Supabase.

const CACHE_NAME = "app-cache-v2026-05-22-01";
const DATA_CACHE = "app-data-v2026-05-22-01";
const PRECACHE_URLS = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== DATA_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Supabase REST GET (books/verses/devotionals/app_settings):
  // Stale-While-Revalidate para garantir leitura offline.
  if (url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/rest/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(DATA_CACHE);
        const cached = await cache.match(req);
        const networkPromise = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || networkPromise;
      })(),
    );
    return;
  }

  // Ignora outras chamadas Supabase (auth, realtime, storage uploads)
  if (url.hostname.includes("supabase.co")) return;

  // Navegação HTML: NetworkFirst com fallback ao shell
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req, { cache: "no-store" });
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          return cached || (await caches.match("/")) || Response.error();
        }
      })(),
    );
    return;
  }

  // Assets (JS, CSS, fontes, imagens): Stale-While-Revalidate
  const isAsset =
    url.origin === self.location.origin ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("i.ytimg.com");

  if (isAsset) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })(),
    );
  }
});

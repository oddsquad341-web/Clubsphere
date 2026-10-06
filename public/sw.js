// ClubSphere service worker.
// Only same-origin static assets are cached. Supabase / API / third-party responses are never
// cached here, so one user's data can never be served to another user on a shared device.
const CACHE = "clubsphere-v2";
const STATIC = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;      // Supabase, Razorpay, fonts… → network only
  if (url.pathname.startsWith("/api/")) return;          // our serverless functions → network only
  if (req.mode === "navigate") {                         // pages: network first, offline fallback
    e.respondWith(fetch(req).catch(() => caches.match("/index.html")));
    return;
  }
  // static assets: stale-while-revalidate
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener("push", e => {
  let data = { title: "ClubSphere", body: "You have a new notification", url: "/" };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch {}
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: "/icon-192.png", badge: "/icon-192.png", vibrate: [200, 100, 200], data: { url: data.url || "/" },
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return clients.openWindow(target);
  }));
});

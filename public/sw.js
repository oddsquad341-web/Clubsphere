const CACHE = "clubsphere-v1";
const STATIC = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener("push", e => {
  const data = e.data?.json() || { title: "ClubSphere", body: "You have a new notification" };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: "/icon-192.png", badge: "/icon-192.png", vibrate: [200, 100, 200]
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow("/"));
});

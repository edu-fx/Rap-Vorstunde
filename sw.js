// Offline-Speicher für das Lernprogramm (wird von build.py als veroeffentlichen/sw.js geschrieben).
// Seite: zuerst Netz (damit Updates ankommen), sonst Speicher. Bilder/Icons: zuerst Speicher.
// Das YouTube-Video wird nicht gespeichert – dafür braucht es WLAN.
const CACHE = 'lp-rap-vorstunde-20261011112053';
const CORE = ['./', './index.html', './manifest.webmanifest',
  './assets/bg_meer.jpg', './assets/bg_studio.jpg',
  './assets/figur_pashanim.jpg', './assets/icon-180.png', './assets/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
  })));
});

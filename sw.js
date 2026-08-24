/**
 * Offline support. The gym basement with no signal is exactly where this app
 * needs to work, so every asset is precached and served cache-first.
 */

const VERSION = 'atn-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/store.js',
  './js/ui.js',
  './js/data/program.js',
  './js/data/exercises.js',
  './js/data/nutrition.js',
  './js/views/today.js',
  './js/views/plan.js',
  './js/views/progress.js',
  './js/views/fuel.js',
  './js/views/settings.js',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      // addAll is atomic — one 404 would poison the whole install, so add
      // individually and let a missing optional asset slide.
      .then(cache => Promise.all(ASSETS.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(hit => {
      if (hit) {
        // Refresh in the background so an update lands on the next launch.
        event.waitUntil(
          fetch(request)
            .then(res => res && res.ok && caches.open(VERSION).then(c => c.put(request, res)))
            .catch(() => {})
        );
        return hit;
      }
      return fetch(request)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            event.waitUntil(caches.open(VERSION).then(c => c.put(request, copy)));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});

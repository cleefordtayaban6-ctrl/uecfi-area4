// ============================================================
// SERVICE WORKER — para sa UECFI Lyrics Area 4
// Ito ang "brain" ng offline mode ng PWA. Kailangan itong nasa
// SAME folder ng index.html, dahil ganito ito tinatawag doon:
//   navigator.serviceWorker.register('sw.js')
// ============================================================

// PALITAN ang bersyon (v5 -> v6) kapag nag-update ka ng index.html,
// para malaman ng browser na "luma na" ang naka-cache.
const CACHE_NAME = 'uecfi-lyrics-v5';

// IMPORTANTE: Sa index.html mo, naka-embed na ang manifest AT ang
// mga icon bilang base64 data URI (data:application/manifest+json;base64,...
// at data:image/jpeg;base64,...). Ibig sabihin, WALA nang hiwalay na
// manifest.json o icons/ folder na kailangang i-fetch — nasa loob na
// mismo ng index.html ang lahat ng yun.
//
// Kaya ang tanging kailangang i-cache dito ay ang index.html mismo.
// (Ang lumang bersyon ng file na ito ay sinusubukang i-cache ang
// './manifest.json' at './icons/icon-192.png' — mga files na WALANG
// katumbas sa totoong project mo, kaya nagfa-fail ang buong
// cache.addAll() at hindi na gumagana ang offline mode.)
const filesToCache = [
  './',
  './index.html',
  './data.js'
];

// ============================================================
// INSTALL EVENT
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Nag-iinstall...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Nag-ca-cache ng app shell files...');
        return cache.addAll(filesToCache).then(() =>
          // Also pre-cache every member photo referenced in data.js (offline-ready).
          fetch('./data.js').then((r) => r.text()).then((txt) => {
            const photos = [...new Set((txt.match(/photos\/[^"'`\s)]+\.(?:jpe?g|png|webp|gif)/gi) || []))];
            return Promise.all(photos.map((p) => cache.add(encodeURI(p)).catch(() => {})));
          }).catch(() => {})
        );
      })
      .then(() => {
        console.log('[Service Worker] Install done. Tumatawag ng skipWaiting()...');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Nag-fail ang pag-cache:', error);
      })
  );
});

// ============================================================
// ACTIVATE EVENT — nililinis ang mga lumang cache version
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Nag-a-activate...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[Service Worker] Binubura ang lumang cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activate done. Tumatawag ng clients.claim()...');
        return self.clients.claim();
      })
  );
});

// ============================================================
// FETCH EVENT — cache-first, may network fallback
// ============================================================
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-while-revalidate: serve instantly, refresh cache in background.
          fetch(request).then((r) => {
            if (r && r.status === 200) caches.open(CACHE_NAME).then((c) => c.put(request, r.clone()));
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });

            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Nag-fail ang fetch:', error);

            if (request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// ============================================================
// MESSAGE EVENT — para sa "I-update" button sa index.html (kung meron)
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Natanggap ang SKIP_WAITING message.');
    self.skipWaiting();
  }
});

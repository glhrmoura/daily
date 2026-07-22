const APP_VERSION = 27;
const CACHE_NAME = `daily-app-v${APP_VERSION}-${Date.now()}`;
const STATIC_CACHE = `daily-app-static-v${APP_VERSION}`;
const DYNAMIC_CACHE = `daily-app-dynamic-v${APP_VERSION}`;
const FONT_CACHE = `daily-app-fonts-v${APP_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== FONT_CACHE
            ) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (
    url.origin !== location.origin &&
    !url.hostname.includes('fonts.googleapis.com') &&
    !url.hostname.includes('fonts.gstatic.com')
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        if (request.destination === 'document') {
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
            })
            .catch(() => {});
        }
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          let cacheToUse = DYNAMIC_CACHE;

          if (urlsToCache.includes(url.pathname) || urlsToCache.includes(request.url)) {
            cacheToUse = STATIC_CACHE;
          } else if (
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com')
          ) {
            cacheToUse = FONT_CACHE;
          }

          caches.open(cacheToUse).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }
          throw new Error('Network request failed');
        });
    }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: APP_VERSION });
  }
});

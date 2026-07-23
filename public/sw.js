const APP_VERSION = 13;
const CACHE_NAME = `dailyapp-v${APP_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function putInCache(request, response) {
  if (
    !response ||
    response.status !== 200 ||
    (response.type !== 'basic' && response.type !== 'cors')
  ) {
    return;
  }

  const responseToCache = response.clone();
  caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, responseToCache);
  });
}

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

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (networkResponse) => {
          if (networkResponse.ok) {
            putInCache('/index.html', networkResponse.clone());
            putInCache('/', networkResponse.clone());
            return networkResponse;
          }

          return (
            (await caches.match('/index.html')) ||
            (await caches.match('/')) ||
            networkResponse
          );
        })
        .catch(async () => {
          return (
            (await caches.match('/index.html')) ||
            (await caches.match('/')) ||
            (await caches.match('/offline.html')) ||
            Response.error()
          );
        }),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        putInCache(request, networkResponse);
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error('Network request failed');
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

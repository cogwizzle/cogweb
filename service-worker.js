const baseUrl = self.registration.scope;
const OFFLINE_VERSION = 1;
const CACHE_NAME = `offline_v${OFFLINE_VERSION}`;
console.log(self.registration.scope);
const cachedFiles = [
  `${self.registration.scope}`,
  `${self.registration.scope}index.html`,
  `${self.registration.scope}src/app.js`,
  `${self.registration.scope}src/component/blog-entry-page.js`,
  `${self.registration.scope}src/component/blog-entry.js`,
  `${self.registration.scope}src/component/blog-list.js`,
  `${self.registration.scope}src/component/blog-router.js`,
  `${self.registration.scope}src/component/header.js`,
  `${self.registration.scope}src/component/home-page.js`,
  `${self.registration.scope}src/component/page-loading-bar.js`,
  `${self.registration.scope}src/component/title-page-layout.js`,
  `${self.registration.scope}src/component/toast.js`,
  `${self.registration.scope}src/services/blog-service.js`,
  `${self.registration.scope}src/utility/observable.js`,
];

self.addEventListener('install', (event) => {
  const createCache = async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      return cache.addAll(cachedFiles);
    } catch (error) {
      console.log('Error creating cache: ', error);
    }
  };
  event.waitUntil(createCache());
});

// On fetch cache files
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, clone } = request;
  const handleReponse = async () => {
    if (event.request.url.indexOf('/api') > -1) {
      try {
        const response = await fetch(event.request);
        if (!response.ok) throw error('Unable to reach resource.');
        const cache = caches.open(CACHE_NAME);
        cache.then((cache) => cache.put(clone(), response));
        return response;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(url);
      }
    }
    if (event.request.mode === 'navigate') {
      console.log('navigate: ');
      try {
        const response = await fetch(event.request);
        console.log(response);
        if (!response.ok) throw error('Unable to reach resource.');
        const cache = await caches.open(CACHE_NAME);
        await cache.put(clone(), response);
        return response;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        console.log(cache, await cache.keys());
        console.log('match: ', await cache.match(url));
        return cache.match(url);
      }
    }
    return fetch(event.request);
  };
  event.respondWith(handleReponse());
});

self.addEventListener('activate', function (event) {
  var cacheAllowlist = ['offline'];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

console.log('service worker complete.');

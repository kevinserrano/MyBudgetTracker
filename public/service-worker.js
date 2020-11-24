const cacheFiles = [
  '/',
  '/styles.css',
  '/index.html',
  '/index.js',
  '/db.js',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

const cacheName = "static-cache-v2";
const dataCacheName = "data-cache-v1";

// install
self.addEventListener("install",(event) => {
event.waitUntil(
  caches.open(cacheName).then(cache => {
    console.log("Your files were pre-cached successfully!");
    return cache.addAll(cacheFiles);
  })
);
});

// activate
self.addEventListener("activate",(event) => {
event.waitUntil(
  caches.keys().then(keyList => {
    return Promise.all(
      keyList.map(key => {
        if (key !== cacheName && key !== dataCacheName) {
          console.log("Removing old cache data", key);
          return caches.delete(key);
        }
      })
    );
  })
);

self.clients.claim();
});

// fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((r) => {
          console.log("Service Worker Fetching resource: "+event.request.url);
      return r || fetch(event.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
          console.log("Service Worker Caching new resource: "+event.request.url);
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
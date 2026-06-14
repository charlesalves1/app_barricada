/* eslint-disable no-restricted-globals */

const CACHE_NAME = "tem-barricada-ai-v2";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/icons/barricada-amarela.png",
  "/icons/barricada-laranja.png",
  "/icons/barricada-vermelha.png",
];

self.addEventListener(
  "install",
  (event) => {
    console.log(
      "[Service Worker] Instalado"
    );

    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(
            urlsToCache
          );
        })
    );

    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  (event) => {
    console.log(
      "[Service Worker] Ativado"
    );

    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map(
              (cacheName) => {
                if (
                  cacheName !== CACHE_NAME
                ) {
                  return caches.delete(
                    cacheName
                  );
                }
              }
            )
          );
        })
    );

    self.clients.claim();
  }
);

self.addEventListener(
  "fetch",
  (event) => {
    event.respondWith(
      caches.match(event.request).then(
        (cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(
            event.request
          ).catch(() => {
            return caches.match("/");
          });
        }
      )
    );
  }
);
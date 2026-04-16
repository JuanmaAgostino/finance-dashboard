const CACHE_NAME = 'gastos-app-v5'; // Versión limpia sin iconos faltantes
const URLS_TO_CACHE = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Le decimos que se active inmediatamente
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Borra todas las cachés viejas que no coincidan con la nueva versión
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      ).then(() => self.clients.claim()); // Toma control de todas las pestañas abiertas
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Estrategia "Network First" ABSOLUTA para TODO.
  // Siempre descarga la versión más reciente de tu código.
  // Solo si te quedas sin conexión (catch), busca en la memoria caché.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match('/');
      });
    })
  );
});
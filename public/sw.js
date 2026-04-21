self.addEventListener('install', (event) => {
  console.log('Service Worker instalado correctamente.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado.');
});

self.addEventListener('fetch', (event) => {
  // Este evento vacío es el requisito mínimo obligatorio 
  // para que Chrome reconozca la aplicación como instalable (PWA)
});
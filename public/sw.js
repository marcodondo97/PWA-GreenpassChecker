const CACHE_NAME = 'greenpass-checker-v5';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/img/greenpasschecker48.png',
  '/img/greenpasschecker96.png',
  '/img/greenpasschecker144.png',
  '/img/greenpasschecker192.png',
  '/img/greenpasschecker512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
            caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll(urlsToCache);
          })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Block any react-toastify requests
  if (event.request.url.includes('react-toastify') || event.request.url.includes('toastify')) {
    return new Response('', { status: 404 });
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

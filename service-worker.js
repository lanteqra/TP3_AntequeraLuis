// SERVICE WORKER

const CACHE_NAME = 'la-forge-v1.3.1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/auteurInfo.html',
    '/oeuvresInfo.html',
    '/communaute.html',
    '/offline.html',
    '/manifest.json',
    '/css/style.css',
    '/js/main.js',
    '/js/carousel.js',
    '/js/navbar.js',
    '/js/chiffres.js',
    '/media/logo-icons/icon-andr-192x192.png',
    '/media/logo-icons/icon-andr-512x512.png'
];

// SERVICE WORKER
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) =>
            cache.addAll(FILES_TO_CACHE)
        )
    );
    self.skipWaiting();
});

// ACTIVATION
self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }))
        )
    );
    self.clients.claim();
});
// STRATEGIES DE CACHE
self.addEventListener('fetch', (evt) => {
    const { request } = evt;

    if (request.method !== 'GET') return;

    // NAVIGATION → Network First
    if (request.mode === 'navigate') {
        evt.respondWith(
            fetch(request).catch(() =>
                caches.match(request).then((r) =>
                    r || caches.match('offline.html')))
        );
        return;
    }

    // RESSOURCES STATIQUES → Cache First
    evt.respondWith(
        caches.match(request).then((cached) =>
            cached || fetch(request))
    );
});

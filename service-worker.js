// SERVICE WORKER

const CACHE_NAME = 'la-forge-v1.4.6';
const FILES_TO_CACHE = [
    './',
    'index.html',
    'auteurInfo.html',
    'oeuvresInfo.html',
    'communaute.html',
    'offline.html',
    'manifest.json',
    'css/style.css',
    'js/carousel.js',
    'js/navbar.js',
    'js/chiffres.js',
    'media/logo-icons/icon-andr-192x192.png',
    'media/logo-icons/icon-andr-512x512.png',
    'media/logo-icons/icon-ms-144x144.png',
    'media/hero/hero.jpg',
    'media/logo-icons/auteur-96x96.png',
    'media/logo-icons/oeuvres-96x96.png',
    'media/carousel/scadraial.svg',
    'media/carousel/roshar.svg',
    'media/carousel/sel.svg',
    'media/carousel/nalthis.svg',
    'media/carousel/taldain.svg',
    'media/carousel/firstofthesun.svg',
    'media/carousel/threnody.svg',
    'media/carousel/cosmere.svg',
    'media/hero/bgsections/bgcosmere.jpg',
    'media/hero/bgsections/bgcosmere2.jpg',
    'favicon-48x48.ico',
    
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
            cached || fetch(request).catch(() =>{
                return new Response('', {status: 408, statusText: 'Ressource indisponible hors ligne'});
            }))
    );
});

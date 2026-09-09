// SERVICE WORKER

const CACHE_NAME = 'la-forge-v1.5.4'; 
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
    'js/fadeInOnScroll.js',
    // img - icons
    'media/logo-icons/icon-andr-192x192.png',
    'media/logo-icons/icon-andr-512x512.png',
    'media/logo-icons/icon-ms-144x144.png',
    'media/manifest-screenshots/screenshot-desktop-1920x1080.png',
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
    'media/page-auteur/brandonsanderson.webp',
    'media/page-auteur/evolution-of-brandons.webp',
    'media/page-auteur/byu-building-benson.jpg',
    'media/page-auteur/byu-leadingedge-41.jpg',
    'media/page-auteur/byu-leadingedge-42.jpg',
    'media/page-auteur/byu-leadingedge-50.jpg',
    'media/page-auteur/brandon-sanderson-david-farland.webp',
    'media/page-auteur/the-first-edition-elantris-cover.jpg',
    'media/page-auteur/the-first-edition-elantris-backcover.jpg',
    'media/page-auteur/evillibrarians.jpg',
    'media/page-auteur/ruetemps.jpg',
    'media/page-auteur/seo-on_img_5013.webp',
    
];

// SERVICE WORKER installation
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
async function cacheFirst(request) {
    try {
        const cached = await caches.match(request);
        if (cached) return cached;

        const response = await fetch(request, {
            mode: 'no-cors',
            credentials: 'omit'
        });

        if (response && (response.status === 200 || response.type === 'opaque')) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }

        return response;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response('', { status: 408, statusText: 'Ressource indisponible hors ligne' });
    }
}

self.addEventListener('fetch', (evt) => {
    const url = evt.request.url;
    const { request } = evt;

    // Ne pas intercepter les requêtes avec Subresource Integrity (SRI, ex: jQuery, Material Icons)
    if (evt.request.integrity) {
        return;
    }

    if (request.method !== 'GET') return;

    // Google Fonts → cache-first
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        evt.respondWith(cacheFirst(evt.request));
        return;
    }

    // CDN externes (GSAP, ScrollTrigger, DaisyUI, Tailwind, jQuery, etc.) → cache-first
    if (
        url.includes('cdnjs.cloudflare.com') ||
        url.includes('cdn.jsdelivr.net') ||
        url.includes('unpkg.com')
    ) {
        evt.respondWith(cacheFirst(evt.request));
        return;
    }

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
            cached || fetch(request).catch(() => {
                return new Response('', { status: 408, statusText: 'Ressource indisponible hors ligne' });
            }))
    );
});
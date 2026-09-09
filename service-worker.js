// SERVICE WORKER

const CACHE_NAME = 'la-forge-v1.5.7'; 
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
     // Libraries
    'https://cdn.jsdelivr.net/combine/npm/daisyui@5/base/rootscrolllock.css,npm/daisyui@5/base/properties.css,npm/daisyui@5/base/scrollbar.css,npm/daisyui@5/base/rootscrollgutter.css,npm/daisyui@5/base/svg.css,npm/daisyui@5/base/rootcolor.css,npm/daisyui@5/base/reset.css,npm/daisyui@5/components/carousel.css',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js',
    'https://unpkg.com/boxicons@2.1.4/dist/boxicons.js',
    'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
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
            cached || fetch(request).catch(() => {
                return new Response('', { status: 408, statusText: 'Ressource indisponible hors ligne' });
            }))
    );
});
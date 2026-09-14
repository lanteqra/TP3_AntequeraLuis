// SERVICE WORKER

const CACHE_NAME = 'la-forge-v1.7.6';
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
    'js/install.js',
    'js/ios-hint.js',
    'js/slideInOnScroll.js',
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
    'media/hero/bgsections/bgcosmere3.webp',
    'media/hero/bgsections/bgcosmere4.avif',
    'favicon-48x48.ico',
    'favicon.ico',
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
    'media/hero/bgsections/bgcosmere5.jpg',
    'media/gifs/stormlight-cosmere.gif',
    'media/avatars/kaladin_lit.jpg',
    'media/avatars/vin_brumeuse.jpg',
    'media/avatars/shallan_radieuse.webp',
    'media/avatars/lord-rashek.jpg',
    'media/avatars/kelsier.jpg',
    'media/avatars/sarene-elantris.jpg',
    // Romans indépendants du Cosmère
    'media/couvertures/elantris.jpg',
    'media/couvertures/warbreaker.jpg',
    'media/couvertures/lamedelempereur.webp',
    'media/couvertures/lilenoirebraise.jpg',
    'media/couvertures/arcanum.jpg',
    'media/couvertures/sixieme-crepuscule-autres-nouvelles.jpg',
    'media/couvertures/white-sand.jpg',
    'media/couvertures/yumi-lepeintrecauchemars.jpg',
    'media/couvertures/tress-dela-mer-emeraude_.jpg',
    'media/couvertures/l-ensoleille.jpg',
    // Fils-des-Brumes 
    'media/couvertures/mistborn-1-empire-ultime.jpg',
    'media/couvertures/mistborn-2.jpg',
    'media/couvertures/mistborn-3.jpg',
    'media/couvertures/lalliagedelajustice.jpg',
    'media/couvertures/jeuxdemasques.jpg',
    'media/couvertures/lesbraceletsdeslarmes.jpg',
    'media/couvertures/lemetalperdu.jpg',
    // Les Archives de Roshar
    'media/couvertures/roshar-1a-voie-des-rois.jpg',
    'media/couvertures/roshar-1b-voie-des-rois.jpg',
    'media/couvertures/lelivredesradieux-pt1.jpg',
    'media/couvertures/lelivredesradieux-pt2.jpg',
    'media/couvertures/justiciere-vol1.jpg',
    'media/couvertures/justiciere-vol2.jpg',
    'media/couvertures/rythmeguerre-pt1.jpg',
    'media/couvertures/rythmeguerre-pt2.jpg',
    'media/couvertures/ventetverite-pt1.jpg',
    'media/couvertures/ventetverite-pt2.jpg',
    // romans gratuits
    'media/couvertures/warbreaker-en.jpg',
    'media/couvertures/the-way-of-kings-prime.jpg',
    'media/couvertures/firstborn_final_200px.webp',
    // Libraries
    'https://cdn.jsdelivr.net/npm/daisyui@5',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js',
    'https://unpkg.com/boxicons@2.1.4/dist/boxicons.js',
    'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
];

// SERVICE WORKER installation
self.addEventListener('install', (evt) => {
    /* evt.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) =>
                cache.addAll(FILES_TO_CACHE)
            )
    J'ai choisi une boucle avec try/catch individuel plutôt que cache.addAll() :
    avec addAll(), l'échec d'une seule ressource (ex. un CDN externe indisponible)
    fait échouer TOUT le cache, y compris mes fichiers locaux. Ici, un échec
    isolé n'empêche pas la mise en cache du reste, essentiel pour le offline.

    );*/
    evt.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            const fail = [];
            for (const url of FILES_TO_CACHE) {
                try {
                    await cache.add(url);
                } catch (err) {
                    console.warn('[SW] Fail:', url, err);
                    fail.push(url);
                }
            }
            if (fail.length) {
                console.warn(`[SW] ${fail.length} pas cache:`, fail);
            } else {
                console.log('[SW]');
            }
        })
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
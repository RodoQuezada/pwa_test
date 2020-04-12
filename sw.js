// Asignar nombre y version de la cache 
const CACHE_NAME = 'v1_ultraport_app_pwa';

// Fichero a cachear en la app 
var urlsToCache = [

    './',
    './css/style.css',
    './img/favicon/favicon-16x16.png',
    './img/favicon/favicon-32x32.png',
    './img/favicon/favicon-96x96.png',
    './img/favicon/favicon-256x256.png',
    './img/017-doctor.png',
    './img/010-call.png',
    './img/029-heart.png',
    './img/facebook_1.png',
    './img/instagram.png',
    './img/twitter_1.png'
];

// Evento install 
// instalacion del service worker, 
// almacenar cache de archivos estaticos

self.addEventListener('install', e => {

    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache)
                .then(() => {
                    self.skipWaiting();
                })
        })
        .catch(err => {
            console.log('No se ha registrado el cache: ', err);
        })
    );
});

// Evento activate 
// app funciona sin conexión. 
self.addEventListener('activate', e => {
    const cacheWhitelist = [
        CACHE_NAME
    ];

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {

                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // borrar elementos q  no se necesitan
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            // activar cache en el dispositivo 
            self.clients.claim();
        })
    );

})

// Evento fetch  (actualizar la app)


self.addEventListener('fetch', e => {

    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if (res) {
                // devuelvo los datos del cache 
                return res
            }

            return fetch(e.request);
        })
    );
});
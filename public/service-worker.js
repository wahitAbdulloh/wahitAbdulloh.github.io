importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/detail.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/icon.png', revision: '1' },
  { url: '/icon-192.png', revision: '1' },
  { url: '/icon-512.png', revision: '1' },
  { url: '/apple-icon-192.png', revision: '1' },
  { url: '/pages/home.html',revision: '1' },
  { url: '/pages/favclub.html',revision: '1' },
  { url: '/css/materialize.min.css',revision: '1' },
  { url: '/js/materialize.min.js',revision: '1' },
  { url: '/js/index.js',revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' }
]);
workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);
if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);
const CACHE_NAME = 'soccer-v1';

self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/v2/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
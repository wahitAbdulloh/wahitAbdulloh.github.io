importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

// cache name
workbox.core.setCacheNameDetails({
  prefix: 'soccer-v1',
  precache: 'precache',
  runtime: 'runtime',
});

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

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'soccer-data-api',
      cacheExpiration: {
          maxAgeSeconds: 60 * 30 //cache the news content for 30mn
      }
  })
);

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

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
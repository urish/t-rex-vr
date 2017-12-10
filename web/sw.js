var CACHE_NAME = 't-rex-cache-v1';
var urlsToCache = [
  // caches all files in t-rex-vr
  '/',
  // caches all external files/ libraries
  'https://ucarecdn.com/d86697ef-c9b9-4b74-912b-6e332adc80cd/',
  'https://aframe.io/releases/0.7.0/aframe.min.js',
  'https://dist.3d.io/3dio-js/1.x.x/3dio.min.js',
  'https://cdn.rawgit.com/zcanter/aframe-gradient-sky/master/dist/gradientsky.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(urlsToCache);
        })
        .catch(function(err){
          console.error(err); // eslint-disable-line no-console
        })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(function(err){
        console.error(err); // eslint-disable-line no-console
      })
    );
});


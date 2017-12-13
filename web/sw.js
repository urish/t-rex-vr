self.importScripts('https://unpkg.com/idb-keyval@2.3.0/dist/idb-keyval-min.js')

var contentTypeHeader = new Headers({'Content-Type': 'application/json'})
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
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
        .catch(function(err){
          console.log('Could not cache files\n', err)
        })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit for GET requests - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();
        var cacheRequest = event.request

        // Archilogic JSONRPC requests
        if (event.request.method === 'POST' && event.request.url.match(/spaces.archilogic.com/)) {

          return event.request.json().then(function(jsonRpcRequest) {
            console.log('JSON RPC request', jsonRpcRequest)

            // furniture requests - let's cache them!
            if (jsonRpcRequest.method == 'Product.read') {
              var productId = jsonRpcRequest.params.resourceId

              // check if the product is already in the IndexedDB
              return idbKeyval.get(productId).then(function (storedValue) {
                if (storedValue) {
                  // need to update id in the response for the 3dio.js to be able to match request and response
                  storedValue.id = jsonRpcRequest.id
                  return new Response(new Blob([JSON.stringify(storedValue)], { contentType: "application/json" }), { headers: contentTypeHeader })
                }

                // if not, let's fetch the product and save it
                console.log('Stored value NOT found!')
                return fetch(fetchRequest.clone())
                  .then(function (response) { return response.json() })
                  .then(function (product) {
                    idbKeyval.set(productId, product)
                    console.log('Product stored')
                    return new Response(new Blob([JSON.stringify(product)], {contentType: "application/json"}), {headers: contentTypeHeader})
                  })
              })
            } else {
              // TODO potentially cache?
              return fetch(fetchRequest)
            }
          })
       } else {

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response

            if (!response || response.status !== 200 ) {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log('put:', cacheRequest.url)
                cache.put(cacheRequest, responseToCache);
              });

            return response;
          });
        }
      })
      .catch(function(err){
        console.log('Fatal error\n',err)
      })
    );
});


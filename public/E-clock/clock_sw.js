
self.addEventListener('install', (event) => {
    console.log(`\n>-------> install app - caching files ('clock-102-v2') >------->\n`);
    console.log(111, "\n... AAA ... Service worker -> install 'sw.js' ...");
    const urlsToCache = [
        '../E-clock/clock_sw.js',
        '../E-clock/clock102.html',
        '../E-clock/clock192.png',
        '../E-clock/clock512.png',
        '../E-clock/manifest.json',
    ];
    event.waitUntil(
        caches.open('clock-102-v2')
          .then((cache) => {
            // Instead of cache.addAll(urlsToCache), fetch and add each URL individually
            return Promise.all(urlsToCache.map(url => {
              if (url === '/' || url.startsWith('chrome-extension://')) {
                console.warn(1.1111, `......... NOT caching ( ${url} ) .........`, url);
                return; // Allow the default browser behavior (fetching from network)
              }
              return fetch(url).then(response => {
              console.log(2.1111, ` ( ${url} ) -> fetching file = ${response.ok}  +++++++++`);
                if (!response.ok) {
                  console.warn(3.1111, `- Failed to fetch ( ${url} ) response = ${response.status}`);
                  // You can choose to throw an error, skip caching this URL,
                  // or handle it differently based on your requirements.
                  throw new Error(`Failed to fetch ( ${url} ) status = ${response.status}`);
                }
                return cache.put(url, response);
              }).catch(error => {
                console.error(4.1111, `>-> Error caching ( ${url} ) =>  ${error}`);
                // Handle the error (e.g., log it, but don't fail the entire install)
                // Depending on your app, you might want to throw the error
                // to fail the install if certain resources are critical.
                // throw error; // Uncomment this line if you want to fail the install on error
              });
            }));
          })
    );
});

self.addEventListener("activate", event => {
    console.log("\n... CCC ... Service worker -> activate 'sw.js' ...\n\n");
    //alert("3...Service worker activated 'sw.js' ...");
});

self.addEventListener('fetch', (event) => {
    console.log("\n ... BBB ... Service worker -> fetch 'sw.js' ...");
      // 1. Check if the request is for an asset we should try to cache/serve from cache
      const url = new URL(event.request.url);
      // Example: only cache GET requests and requests not to a specific external API
      if (event.request.method !== 'GET' || url.hostname === 'api.some-external-site.com') {
        // If not, let the browser handle it normally
        return;
      }

  // 2. Respond with the result of the cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // A. If we have a match in the cache, return it immediately
        if (cachedResponse) {
          console.log(1.2222, `[ sw.js ] Serving from || cache ||: ${url.pathname}`);
          return cachedResponse;
        }

        // B. If no match, fetch the request from the network
        console.log(2.2222, `[ sw.js ] Fetching from \\ network \\: ${url.pathname}`);
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // C. IMPORTANT: Clone the response. A response is a stream and can only be
            // consumed once. We need one copy for the browser and one for the cache.
            const responseToCache = response.clone();

            // D. Open the designated cache and put the new response in it
            caches.open('clock-202-v2')
              .then((cache) => {
                if ( !event.request.url.startsWith('chrome-extension://') ) {
                  cache.put(event.request, responseToCache);
                  console.log(3.2222, `[ sw.js ] New asset || cached ||: ${url}`);
                } else {
                    console.log(4.2222, event.request.url.startsWith('chrome-extension://'), 'NOT cache.put(e.request):: ' + event.request.url );
                }
              }) 
              .catch ( (er) => { console.warn(5.2222, er, url) })
            // E. Return the original (non-cloned) response to the browser
            return response;
          })
          .catch((error) => {
            // Handle network errors (e.g., user is offline)
            console.error(6.2222, 'ERROR :: [ sw.js ] **** Fetch failed **** ', error);
            // You can serve a custom offline page here if the request was for an HTML page
            // return caches.match('/offline.html');
          });
      })
  );
});
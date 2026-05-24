const CACHE_NAME = "password-gen-v1";
const FILES_TO_CACHE = [
  "../C-pw-gen/favicon.png",
  "../C-pw-gen/icon192.png",
  "../C-pw-gen/icon512.png",
  "../C-pw-gen/pwgen_sw.js",
  "../C-pw-gen/manifest.json",
  "../C-pw-gen/pwgenertor.html"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});

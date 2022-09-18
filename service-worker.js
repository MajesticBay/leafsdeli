/*
Copyright 2015, 2019, 2020 Google LLC. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
const DYNAMIC_CACHE_NAME = "dynamic";
// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     (async () => {
//       const cache = await caches.open(CACHE_NAME);
//       // Setting {cache: 'reload'} in the new request will ensure that the response
//       // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
//       await cache.add(
//         new Request(OFFLINE_URL, {
//           cache: "reload",
//         })
//       );
//     })()
//   );
//   // Force the waiting service worker to become the active service worker.
//   self.skipWaiting();
// });

let cache_name = 'offline';


let cached_files = [
    'offline.html',
    'img.png'
];
// The reference here should be correct.

// self.addEventListener('install', function (e) {
//   console.log('[ServiceWorker] Install');
//     e.waitUntil(
//         caches.open(cache_name).then(
//           cache => cache.addAll(cached_files)
//         )
//     );
// });

self.addEventListener("install", async event => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(cached_files);
  // self.skipWaiting();
});

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     (async () => {
//       const cache = await caches.open(CACHE_NAME);
//       // Setting {cache: 'reload'} in the new request will ensure that the response
//       // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
//       await cache.add([
//         "/",
//         "/offline.html",
//         "/assets/images/logo.svg",
//         "/assets/images/logos/appstore.png",
//         "/assets/css/main.css",
//       ]);
//     })()
//   );
//   // Force the waiting service worker to become the active service worker.
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     (async () => {
//       // Enable navigation preload if it's supported.
//       // See https://developers.google.com/web/updates/2017/02/navigation-preload
//       if ("navigationPreload" in self.registration) {
//         await self.registration.navigationPreload.enable();
//       }
//     })()
//   );

//   // Tell the active service worker to take control of the page immediately.
//   self.clients.claim();
// });

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name !== CACHE_NAME)
      .map(name => caches.delete(name))
  )
})

self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetch", event.request.url);

  const { request } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }

})

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open(CACHE_NAME);
  try {
    const networked = await fetch(request);
    await dynamicCache.put(request, networked.clone());
    return networked;
  } catch (e) {
    const cached = await dynamicCache.match(request);
    return cached ?? await caches.match(OFFLINE_URL);f
  }
}

// self.addEventListener("fetch", (event) => {
//   console.log("[Service Worker] Fetch", event.request.url);
//   // We only want to call event.respondWith() if this is a navigation request
//   // for an HTML page.
//   if (event.request.mode === "navigate") {
//     event.respondWith(
//       (async () => {
//         try {
//           // First, try to use the navigation preload response if it's supported.
//           const preloadResponse = await event.preloadResponse;
//           if (preloadResponse) {
//             return preloadResponse;
//           }

//           // Always try the network first.
//           const networkResponse = await fetch(event.request);
//           return networkResponse;
//         } catch (error) {
//           // catch is only triggered if an exception is thrown, which is likely
//           // due to a network error.
//           // If fetch() returns a valid HTTP response with a response code in
//           // the 4xx or 5xx range, the catch() will NOT be called.
//           console.log("Fetch failed; returning offline page instead.", error);

//           const cache = await caches.open(CACHE_NAME);
//           const cachedResponse = await cache.match(OFFLINE_URL);
//           return cachedResponse;
//         }
//       })()
//     );
//   }

//   // If our if() condition is false, then this fetch handler won't intercept the
//   // request. If there are any other fetch handlers registered, they will get a
//   // chance to call event.respondWith(). If no fetch handlers call
//   // event.respondWith(), the request will be handled by the browser as if there
//   // were no service worker involvement.
// });

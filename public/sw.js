/* Service worker mínimo — deixa o app instalável na tela inicial. */
const CACHE = 'editor-sao-luiz-v1'

self.addEventListener('install', (event) => {
  const base = self.registration.scope
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll([
          base,
          `${base}index.html`,
          `${base}abrir.html`,
          `${base}logo-sao-luiz.png`,
          `${base}manifest.webmanifest`,
        ]).catch(() => undefined),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  )
})

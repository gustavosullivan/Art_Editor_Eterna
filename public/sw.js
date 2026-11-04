/* Service worker mínimo — deixa o app instalável na tela inicial. */
const CACHE = 'editor-sao-luiz-v2'

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
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  // HTML sempre da rede (evita ficar preso em versão antiga)
  const dest = event.request.destination
  if (dest === 'document' || event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
    return
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => undefined)
        return response
      })
      .catch(() => caches.match(event.request)),
  )
})

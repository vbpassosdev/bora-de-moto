const CACHE = 'bora-viagens-offline-v1';
const PREFIX = '/viagens-offline/';

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

async function offlineLibrary() {
  const cache = await caches.open(CACHE);
  const requests = await cache.keys();
  if (requests.length === 1) return cache.match(requests[0]);
  const links = await Promise.all(requests.map(async request => {
    const entry = await cache.match(request);
    const title = decodeURIComponent(entry.headers.get('X-Bora-Title') || 'Viagem');
    const safeTitle = title.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    return '<li><a href="' + new URL(request.url).pathname + '">' + safeTitle + '</a></li>';
  }));
  return new Response('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Viagens offline</title><main style="font:18px system-ui;padding:20px"><h1>Viagens offline</h1>' +
    (links.length ? '<ul>' + links.join('') + '</ul>' : '<p>Conecte-se e use Baixar viagem no planejador.</p>') + '</main></html>',
    {headers:{'Content-Type':'text/html; charset=utf-8'}});
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.mode !== 'navigate') return;
  if (url.pathname.startsWith(PREFIX)) {
    event.respondWith(caches.open(CACHE).then(async cache =>
      (await cache.match(url.pathname)) || offlineLibrary()));
  } else if (['/', '/planejar', '/planejar/'].includes(url.pathname)) {
    event.respondWith(fetch(event.request).catch(offlineLibrary));
  }
});

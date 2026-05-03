/* eatrail · service worker
 * Cache strategy:
 *   - app shell (HTML/CSS/JS/data) → cache-first, refresh in background (stale-while-revalidate)
 *   - recipe images (assets/recipes/) → cache-first, long TTL
 *   - API calls (/api/*) → network-first, fallback cache (read-only views)
 *   - everything else → network-only
 */
const VERSION = 'eatrail-v1.7.1';
const STATIC_CACHE = `${VERSION}-static`;
const IMAGE_CACHE = `${VERSION}-images`;
const API_CACHE = `${VERSION}-api`;

// App shell — always pre-cached on install
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/js/config.js',
  '/js/api-client.js',
  '/js/geo.js',
  '/js/auth.js',
  '/js/prefs.js',
  '/js/utils.js',
  '/js/router.js',
  '/js/views.js',
  '/js/app.js',
  '/data/shops.js',
  '/data/images.js',
];

// ─── INSTALL ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(APP_SHELL).catch(err => {
        console.warn('[sw] preCache partial fail (some files may not exist yet):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// ─── FETCH ───────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Cross-origin (Pexels CDN, Google Fonts) → cache-first with long TTL
  if (url.origin !== self.location.origin) {
    if (/\.(jpg|jpeg|png|webp|gif|woff2?|svg|css)(\?|$)/i.test(url.pathname)) {
      event.respondWith(cacheFirst(req, IMAGE_CACHE));
    }
    return;
  }

  // Recipe images → cache-first (long-lived)
  if (url.pathname.startsWith('/assets/recipes/')) {
    event.respondWith(cacheFirst(req, IMAGE_CACHE));
    return;
  }

  // API calls → network-first (so logged-in user always sees latest)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(req, API_CACHE));
    return;
  }

  // App shell + recipe data files → stale-while-revalidate
  if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/data/') ||
      url.pathname === '/' || url.pathname.endsWith('.html') ||
      url.pathname === '/styles.css' || url.pathname === '/manifest.json') {
    event.respondWith(staleWhileRevalidate(req, STATIC_CACHE));
    return;
  }

  // Default: network with cache fallback
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});

// ─── STRATEGIES ──────────────────────────────────────────

async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch (e) {
    return new Response('', { status: 503 });
  }
}

async function networkFirst(req, cacheName) {
  try {
    const res = await fetch(req);
    if (res.ok && req.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'offline', message: 'Hors-ligne — données non disponibles' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const networkPromise = fetch(req).then(res => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || networkPromise;
}

// ─── PUSH NOTIFICATIONS (item #7 wired here) ─────────────
self.addEventListener('push', (event) => {
  const data = (() => {
    try { return event.data?.json() || {}; }
    catch { return { title: 'eatrail', body: event.data?.text() || '' }; }
  })();
  const title = data.title || 'eatrail';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag || 'eatrail-notif',
    data: data.url ? { url: data.url } : null,
    actions: data.actions || [],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

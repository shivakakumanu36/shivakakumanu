/**
 * Service Worker
 * - Offline support
 * - Asset caching
 * - Background sync
 * - Push notifications
 */

const CACHE_PREFIX = 'shivakakumanu';
const CACHE_NAME = `${CACHE_PREFIX}-v2`;
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
];

const DYNAMIC_CACHE = `${CACHE_PREFIX}-dynamic-v2`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-v2`;
const API_CACHE = `${CACHE_PREFIX}-api-v2`;

const CACHE_EXPIRATION = {
  images: 30 * 24 * 60 * 60 * 1000, // 30 days
  api: 24 * 60 * 60 * 1000, // 24 hours
  dynamic: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.warn('Failed to cache some static assets:', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith(CACHE_PREFIX) && ![
            CACHE_NAME,
            DYNAMIC_CACHE,
            IMAGE_CACHE,
            API_CACHE,
          ].includes(name))
          .map((name) => caches.delete(name))
      );
    })
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch event - implement intelligent caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and external hosts
  if (url.hostname === 'chrome-extension') {
    return;
  }

  // Route-based caching strategies
  if (isImageRequest(request)) {
    event.respondWith(cacheImageStrategy(request));
  } else if (isApiRequest(request)) {
    event.respondWith(cacheApiStrategy(request));
  } else if (isDocumentRequest(request)) {
    event.respondWith(cacheDocumentStrategy(request));
  } else {
    event.respondWith(cacheDynamicStrategy(request));
  }
});

/**
 * Cache strategies
 */

function isImageRequest(request) {
  return /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(request.url);
}

function isApiRequest(request) {
  return request.url.includes('/api/') || request.url.includes('.json');
}

function isDocumentRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

/**
 * Cache-first strategy for images
 */
async function cacheImageStrategy(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (!response.ok) {
      return response;
    }

    // Clone and cache the response
    const cloned = response.clone();
    caches.open(IMAGE_CACHE).then((cache) => {
      cache.put(request, cloned);
    });

    return response;
  } catch (error) {
    console.error('Image cache strategy failed:', error);
    return new Response('Image not available', { status: 404 });
  }
}

/**
 * Network-first strategy for API calls
 */
async function cacheApiStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cloned = response.clone();
      caches.open(API_CACHE).then((cache) => {
        cache.put(request, cloned);
      });
      return response;
    }
    return response;
  } catch (error) {
    // Fall back to cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Network-first strategy for documents
 */
async function cacheDocumentStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cloned = response.clone();
      caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, cloned);
      });
      return response;
    }
    return response;
  } catch (error) {
    // Fall back to cache or offline page
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    return caches.match('/offline.html').catch(() => {
      return new Response('Offline - Page not available', { status: 503 });
    });
  }
}

/**
 * Stale-while-revalidate strategy for dynamic content
 */
async function cacheDynamicStrategy(request) {
  try {
    const cached = await caches.match(request);

    // Return cached while fetching update in background
    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        const cloned = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, cloned);
        });
      }
      return response;
    });

    return cached || fetchPromise;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Message handling for cache management
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
});

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  try {
    // Sync any pending analytics data
    const cache = await caches.open(API_CACHE);
    // Implementation depends on analytics backend
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

/**
 * Push notification handling
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || 'ShivaKakumanu notification',
    icon: '/img/logo.svg',
    badge: '/img/badge.svg',
    tag: data.tag || 'notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'ShivaKakumanu', options)
  );
});

/**
 * Notification click handling
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Look for an existing window/tab with the target URL
      for (const client of clientList) {
        if (client.url === event.notification.tag && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab with the target URL
      if (clients.openWindow) {
        return clients.openWindow(event.notification.tag || '/');
      }
    })
  );
});

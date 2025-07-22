const CACHE_NAME = 'smiletracker-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/gift1.html',
    '/gift2.html',
    '/gift3.html',
    '/gift4.html',
    '/gift5.html',
    '/gift6.html',
    '/gift7.html',
    '/gift8.html',
    '/gift9.html',
    '/gift10.html',
    '/gift11.html',
    '/gift12.html',
    '/gift13.html',
    '/gift14.html',
    '/gift15.html',
    '/gift16.html',
    '/gift17.html',
    '/gift18.html',
    '/gift19.html',
    '/gift20.html',
    
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/dist/face-api.min.js',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/ssd_mobilenetv1_model-weights_manifest.json',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/ssd_mobilenetv1_model-shard1',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/face_landmark_68_model-weights_manifest.json',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/face_landmark_68_model-shard1',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/face_expression_model-weights_manifest.json',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/face_expression_model-shard1'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.log('Cache install failed:', error);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }

                return fetch(event.request).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(error => {
                    console.log('Fetch failed:', error);
                    throw error;
                });
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    return new Promise((resolve, reject) => {
        // Implement background sync logic here
        // For example, sync user data when back online
        console.log('Background sync triggered');
        resolve();
    });
}

// Push notifications (for future features)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New smile challenge available!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('SmileTracker', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});


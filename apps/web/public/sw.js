self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push event received!');
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[Service Worker] Push data:', data);
      
      const options = {
        body: data.body || 'Tienes una nueva tarea pendiente',
        ...(data.icon && { icon: data.icon }),
        ...(data.badge && { badge: data.badge }),
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
          url: data.url || '/'
        },
      };

      const title = data.title || 'BEAN Nudge';
      
      event.waitUntil(
        self.registration.showNotification(title, options)
          .then(() => console.log('[Service Worker] Notification shown successfully.'))
          .catch(err => console.error('[Service Worker] Error showing notification:', err))
      );
    } catch (error) {
      console.error('[Service Worker] Error parsing push data:', error);
    }
  } else {
    console.log('[Service Worker] Push event received but no data payload.');
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received.', event.notification.data);
  event.notification.close();

  try {
    const urlToOpen = new URL(event.notification.data?.url || '/schedule', self.location.origin).href;
    console.log('[Service Worker] Opening URL:', urlToOpen);

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        // 1. Try to find a tab with the exact URL and focus it
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            console.log('[Service Worker] Focusing existing exact match tab.');
            return client.focus();
          }
        }
        
        // 2. Try to find ANY open tab of our app, focus it, and navigate to the URL
        if (windowClients.length > 0) {
          console.log('[Service Worker] Navigating existing app tab to URL.');
          const client = windowClients[0];
          if ('focus' in client) client.focus();
          if ('navigate' in client) return client.navigate(urlToOpen);
        }

        // 3. Fallback: open a brand new window/tab
        console.log('[Service Worker] Opening new window.');
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  } catch (err) {
    console.error('[Service Worker] Error in notificationclick:', err);
  }
});

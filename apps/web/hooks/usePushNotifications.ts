'use client';

import { useState, useEffect } from 'react';

// URLB64ToUint8Array is a utility to convert the VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Register Service Worker and then check subscription
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          return registration.pushManager.getSubscription();
        })
        .then((subscription) => {
          setIsSubscribed(subscription !== null);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const subscribe = async () => {
    setIsLoading(true);
    try {
      if (permission === 'denied') {
        throw new Error('Notifications denied');
      }

      // Request permission if not already granted
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        throw new Error('Permission not granted');
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID key from env
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error('VAPID public key not found');

      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Send to our backend
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription on server');
      }

      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    setIsSubscribed(false); // Optimistic UI update
    
    try {
      // 1. Try to unsubscribe from browser if supported
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && registration.pushManager) {
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
              await subscription.unsubscribe();
            }
          }
        } catch (swError) {
          console.warn('[PushNotifications] Non-fatal error during browser unsubscribe:', swError);
        }
      }

      // 2. Always delete from DB regardless of browser state
      await fetch('/api/notifications/subscribe', {
        method: 'DELETE',
      });
      
    } catch (error) {
      console.error('[PushNotifications] Critical error in unsubscribe process:', error);
      setIsSubscribed(true); // Revert ONLY if the DB fetch totally crashes
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}

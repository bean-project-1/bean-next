import webpush from 'web-push';
import type { PushSubscription } from '@prisma/client';

interface NudgePayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendWebPush(subscription: PushSubscription, payload: NudgePayload) {
  // Configure Web Push with VAPID keys here to avoid top-level evaluation errors during Next.js build
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  
  if (publicKey && privateKey) {
    webpush.setVapidDetails(
      'mailto:hello@bean.com',
      publicKey,
      privateKey
    );
  } else {
    console.warn('[DeliveryService] VAPID keys are not configured. Cannot send push notification.');
    return;
  }
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      auth: subscription.auth,
      p256dh: subscription.p256dh,
    },
  };

  const pushPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/',
    icon: '/icon.png', // Make sure this icon exists in public/
    badge: '/badge.png' // Make sure this badge exists in public/
  });

  try {
    await webpush.sendNotification(pushSubscription, pushPayload);
  } catch (error) {
    console.error('[DeliveryService] Error sending push:', error);
    throw error;
  }
}

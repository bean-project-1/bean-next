import webpush from 'web-push';
import type { PushSubscription } from '@prisma/client';

// Configure Web Push with VAPID keys from environment
// You'll need to generate these using `npx web-push generate-vapid-keys` 
// and add them to your .env file.
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

interface NudgePayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendWebPush(subscription: PushSubscription, payload: NudgePayload) {
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

import { prisma } from '@/lib/prisma';
import { generateNudge } from './NotificationAIService';
import { sendWebPush } from './DeliveryService';

export async function runNotificationEngine() {
  console.log('[NotificationEngine] Starting cron job...');

  // 1. Get users who have Web Push Subscriptions and haven't opted out completely
  const users = await prisma.user.findMany({
    where: {
      pushSubscriptions: {
        some: {} // Only users with at least one active push subscription
      }
    },
    include: {
      pushSubscriptions: true,
      dailyTasks: {
        where: {
          isCompleted: false,
        }
      }
    }
  });

  let sentCount = 0;

  for (const user of users) {
    // 2. Check Timezone and Preferences
    // Ideally we check if it's "morning" or "evening" in the user's timezone.
    // For now, we'll just check if they have pending daily tasks.
    if (user.dailyTasks.length === 0) continue;

    // Pick the most important task or just the first one
    const targetTask = user.dailyTasks[0];

    // 3. Generate Persuasive AI Nudge
    const nudge = await generateNudge({
      userName: user.name || 'Beaner',
      taskName: targetTask.title,
    });

    // 4. Deliver Notification
    for (const sub of user.pushSubscriptions) {
      try {
        await sendWebPush(sub, {
          title: nudge.title,
          body: nudge.body,
          url: '/daily' // When they click the notification, go to daily view
        });

        // Log it
        await prisma.notificationLog.create({
          data: {
            userId: user.id,
            type: 'daily_tasks',
            channel: 'web_push',
            title: nudge.title,
            body: nudge.body,
          }
        });

        sentCount++;
      } catch (err) {
        console.error(`[NotificationEngine] Failed to send push to user ${user.id}:`, err);
        // If subscription is expired (410), we could delete it here
      }
    }
  }

  console.log(`[NotificationEngine] Completed. Sent ${sentCount} notifications.`);
  return { sent: sentCount };
}

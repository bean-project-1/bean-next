import { prisma } from '@/lib/prisma';
import { generateNudge } from './NotificationAIService';
import { sendWebPush } from './DeliveryService';

export async function runNotificationEngine() {
  console.log('[NotificationEngine] Starting cron job...');

  // 1. Get users who have Web Push Subscriptions
  const users = await prisma.user.findMany({
    where: {
      pushSubscriptions: { some: {} }
    },
    include: {
      pushSubscriptions: true
    }
  });

  let sentCount = 0;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  for (const user of users) {
    let targetTaskName = null;

    // A. Buscar en DailyTasks pendientes de hoy o pasadas
    const daily = await prisma.dailyTask.findFirst({
      where: { userId: user.id, isCompleted: false, date: { lte: new Date() } }
    });
    if (daily) targetTaskName = daily.title;

    // B. Buscar en GoalActions pendientes (priorizando las que tienen targetDate hoy o antes)
    if (!targetTaskName) {
      const action = await prisma.goalAction.findFirst({
        where: { goal: { userId: user.id }, isCompleted: false, targetDate: { lte: new Date() } }
      });
      if (action) targetTaskName = action.title;
    }

    // C. Buscar cualquier GoalAction pendiente como fallback
    if (!targetTaskName) {
      const fallbackAction = await prisma.goalAction.findFirst({
        where: { goal: { userId: user.id }, isCompleted: false }
      });
      if (fallbackAction) targetTaskName = fallbackAction.title;
    }

    if (!targetTaskName) {
      console.log(`[NotificationEngine] User ${user.id} has no pending tasks anywhere.`);
      continue;
    }

    // 3. Generate Persuasive AI Nudge
    const nudge = await generateNudge({
      userName: user.name || 'Beaner',
      taskName: targetTaskName,
      userId: user.id,
    });

    // 4. Deliver Notification
    for (const sub of user.pushSubscriptions) {
      try {
        await sendWebPush(sub, {
          title: nudge.title,
          body: nudge.body,
          url: '/schedule' // When they click the notification, go to daily view
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

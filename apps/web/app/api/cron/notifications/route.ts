import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runNotificationEngine } from '@/services/notifications/NotificationEngine';

export async function GET(request: Request) {
  // Validate Vercel Cron Secret if configured
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const results = await runNotificationEngine();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Error running Notification Engine:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

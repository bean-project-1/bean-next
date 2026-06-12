import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await req.json();

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    // Check if the endpoint already exists to avoid duplicates
    const existingSub = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint }
    });

    if (existingSub) {
      // If it belongs to a different user, update the user ID
      if (existingSub.userId !== session.user.id) {
         await prisma.pushSubscription.update({
           where: { id: existingSub.id },
           data: { userId: session.user.id }
         });
      }
      return NextResponse.json({ success: true, message: 'Subscription already exists' });
    }

    // Save new subscription
    await prisma.pushSubscription.create({
      data: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    
    const task = await prisma.dailyTask.create({
      data: {
        userId,
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : new Date(),
        estimatedHours: body.estimatedHours || 0,
        isCompleted: false
      }
    });

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('[POST /api/schedule/daily-tasks] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

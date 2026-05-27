import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const task = await prisma.dailyTask.update({
      where: { id, userId },
      data: {
        isCompleted: body.isCompleted !== undefined ? body.isCompleted : undefined,
        title: body.title,
        estimatedHours: body.estimatedHours
      }
    });

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error(`[PATCH /api/schedule/daily-tasks] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.dailyTask.delete({
      where: { id, userId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`[DELETE /api/schedule/daily-tasks] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

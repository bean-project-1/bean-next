import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isCompleted } = await req.json();

    const task = await prisma.task.update({
      where: { id: params.id },
      data: { isCompleted }
    });

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('[PATCH /api/profile/goals/tasks/[id]] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

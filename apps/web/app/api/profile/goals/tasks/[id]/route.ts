import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isCompleted, title, description } = await req.json();

    const updateData: any = {};
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const task = await prisma.task.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('[PATCH /api/profile/goals/tasks/[id]] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

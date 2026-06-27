import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isCompleted, title, description, notes } = await req.json();

    const updateData: any = {};
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (notes !== undefined) updateData.notes = notes;

    const task = await prisma.task.update({
      where: { id },
      data: updateData
    });

    // Auto-sync parent GoalAction completion when a subtask is toggled
    if (isCompleted !== undefined && task.goalActionId) {
      const siblings = await prisma.task.findMany({
        where: { goalActionId: task.goalActionId },
        select: { isCompleted: true }
      });
      const allDone = siblings.every(s => s.isCompleted);
      await prisma.goalAction.update({
        where: { id: task.goalActionId },
        data: { isCompleted: allDone }
      });
    }

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('[PATCH /api/profile/goals/tasks/[id]] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.task.delete({
      where: { id }
    });
    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/profile/goals/tasks/[id]] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


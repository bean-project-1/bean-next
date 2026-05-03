import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Verify ownership
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: { actions: { include: { tasks: true } } }
    });

    if (!goal || goal.userId !== userId) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    // 2. Cascaded delete
    const actionIds = goal.actions.map(a => a.id);
    
    await prisma.$transaction([
      // a. Delete all Tasks associated with these actions
      prisma.task.deleteMany({
        where: { goalActionId: { in: actionIds } }
      }),
      // b. Delete all Sub-actions (nested) first to satisfy recursive relation
      prisma.goalAction.deleteMany({
        where: { goalId: id, parentId: { not: null } }
      }),
      // c. Delete all remaining GoalActions for this goal (including parents and habits)
      prisma.goalAction.deleteMany({
        where: { goalId: id }
      }),
      // d. Delete the Goal itself
      prisma.goal.delete({
        where: { id }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/profile/goals/[id]]', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      detail: error.message 
    }, { status: 500 });
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { goal, description } = body;

    // Verify ownership
    const existing = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    // Update the goal
    const updated = await prisma.goal.update({
      where: { id },
      data: {
        title: goal !== undefined ? goal : undefined,
        description: description !== undefined ? description : undefined,
      },
    });

    return NextResponse.json({ success: true, goal: updated });
  } catch (error: any) {
    console.error('[PATCH /api/profile/goals/[id]]', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      detail: error.message 
    }, { status: 500 });
  }
}

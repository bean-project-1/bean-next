import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Verify ownership
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: { actions: { include: { tasks: true } } }
    });

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (goal.userId !== userId) {
      if (goal.spaceId) {
        const member = await (prisma as any).spaceMember.findFirst({
          where: { spaceId: goal.spaceId, userId }
        });
        if (!member) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { goal, description } = body;

    // Verify ownership or space membership
    const existing = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (existing.userId !== userId) {
      if (existing.spaceId) {
        const member = await (prisma as any).spaceMember.findFirst({
          where: { spaceId: existing.spaceId, userId }
        });
        if (!member) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
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

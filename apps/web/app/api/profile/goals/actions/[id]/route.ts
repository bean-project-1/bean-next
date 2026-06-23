import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// DELETE - Remove a goal action
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Verify ownership (via goal) or space membership
    const action = await prisma.goalAction.findUnique({
      where: { id },
      include: { goal: true }
    });

    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    if (action.goal.userId !== userId) {
      if (action.goal.spaceId) {
        const member = await (prisma as any).spaceMember.findFirst({
          where: { spaceId: action.goal.spaceId, userId }
        });
        if (!member) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // 2. Cascaded delete
    await prisma.$transaction([
      // a. Delete all Tasks associated with THIS action
      prisma.task.deleteMany({
        where: { goalActionId: id }
      }),
      // b. Delete all SUB-ACTIONS (children) of this action
      prisma.goalAction.deleteMany({
        where: { parentId: id }
      }),
      // c. Delete the action itself
      prisma.goalAction.delete({
        where: { id },
      })
    ]);

    return NextResponse.json({ success: true, message: 'Action deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/profile/goals/actions/[id]]', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      detail: error.message 
    }, { status: 500 });
  }
}

// PATCH - Update a goal action (e.g. toggle completion)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { isCompleted, title, targetDate, dimensions, attributes, description } = await req.json();

    // 1. Verify ownership (via goal) or space membership
    const action = await prisma.goalAction.findUnique({
      where: { id },
      include: { goal: true }
    });

    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    if (action.goal.userId !== userId) {
      if (action.goal.spaceId) {
        const member = await (prisma as any).spaceMember.findFirst({
          where: { spaceId: action.goal.spaceId, userId }
        });
        if (!member) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // 2. Update the action
    const updated = await prisma.goalAction.update({
      where: { id },
      data: {
        isCompleted: typeof isCompleted === 'boolean' ? isCompleted : action.isCompleted,
        title: title || action.title,
        description: description !== undefined ? description : action.description,
        targetDate: targetDate !== undefined ? (targetDate ? new Date(targetDate) : null) : action.targetDate,
        dimensions: Array.isArray(dimensions) ? dimensions : action.dimensions,
        attributes: Array.isArray(attributes) ? attributes : action.attributes,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('[PATCH /api/profile/goals/actions/[id]]', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      detail: error.message 
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../../../../lib/generated-prisma');

// DELETE - Remove a goal action
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  const { id } = params;

  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Verify ownership (via goal)
    const action = await (prisma as any).goalAction.findUnique({
      where: { id },
      include: { goal: true }
    });

    if (!action || action.goal.userId !== userId) {
      return NextResponse.json({ error: 'Action not found or unauthorized' }, { status: 404 });
    }

    // 2. Delete the action
    await (prisma as any).goalAction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Action deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/profile/goals/actions/[id]]', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      detail: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH - Update a goal action (e.g. toggle completion)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  const { id } = params;

  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { isCompleted, title, targetDate, dimensions, attributes } = await req.json();

    // 1. Verify ownership (via goal)
    const action = await (prisma as any).goalAction.findUnique({
      where: { id },
      include: { goal: true }
    });

    if (!action || action.goal.userId !== userId) {
      return NextResponse.json({ error: 'Action not found or unauthorized' }, { status: 404 });
    }

    // 2. Update the action
    const updated = await (prisma as any).goalAction.update({
      where: { id },
      data: {
        isCompleted: typeof isCompleted === 'boolean' ? isCompleted : action.isCompleted,
        title: title || action.title,
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
  } finally {
    await prisma.$disconnect();
  }
}

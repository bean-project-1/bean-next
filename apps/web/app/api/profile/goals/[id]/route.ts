import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../../../lib/generated-prisma');

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

    // 1. Verify ownership
    const goal = await (prisma as any).goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== userId) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    // 2. Delete actions first (manual cascade if not in schema)
    await (prisma as any).goalAction.deleteMany({
      where: { goalId: id },
    });

    // 3. Delete the goal
    await (prisma as any).goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/profile/goals/[id]]', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      detail: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
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

    const body = await req.json();
    const { goal, description } = body;

    // Verify ownership
    const existing = await (prisma as any).goal.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    // Update the goal
    const updated = await (prisma as any).goal.update({
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
  } finally {
    await prisma.$disconnect();
  }
}

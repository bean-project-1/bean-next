import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../../../../lib/generated-prisma');

// POST - Add a new action to a goal
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  const goalId = params.id;

  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, targetDate, dimensions, attributes } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // 1. Verify goal ownership
    const goal = await (prisma as any).goal.findUnique({
      where: { id: goalId }
    });

    if (!goal || goal.userId !== userId) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    // 2. Create the action
    const newAction = await (prisma as any).goalAction.create({
      data: {
        goalId,
        title: name,
        isCompleted: false,
        targetDate: targetDate ? new Date(targetDate) : null,
        dimensions: Array.isArray(dimensions) ? dimensions : [],
        attributes: Array.isArray(attributes) ? attributes : [],
      }
    });

    // 3. Recalculate goal progress
    const allActions = await (prisma as any).goalAction.findMany({
      where: { goalId }
    });
    const completedCount = allActions.filter((a: any) => a.isCompleted).length;
    const progress = Math.round((completedCount / allActions.length) * 100);

    await (prisma as any).goal.update({
      where: { id: goalId },
      data: { progress }
    });

    return NextResponse.json({ success: true, data: newAction });
  } catch (error: any) {
    console.error('[POST /api/profile/goals/[id]/actions]', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      detail: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

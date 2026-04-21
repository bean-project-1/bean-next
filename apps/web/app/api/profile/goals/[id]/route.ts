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

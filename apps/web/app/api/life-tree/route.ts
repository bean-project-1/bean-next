import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../lib/generated-prisma');

export async function GET(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Fetch User Goals with their Actions (Dynamic to user's actual goals)
    const goals = await (prisma as any).goal.findMany({
      where: { userId },
      include: {
        actions: true
      }
    });

    // 2. Fetch latest LifeState for the total growth score
    const latestState = await (prisma as any).lifeState.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });

    // 3. Map to TreeData structure (Branches = Goals)
    const treeData = {
      growthScore: Math.round(latestState?.lifeScore || 0),
      branches: goals.map((goal: any) => ({
        id: goal.id,
        goal: goal.title,
        progress: goal.progress || 0,
        leaves: (goal.actions || []).map((action: any) => ({
          id: action.id,
          name: action.title,
          completed: action.isCompleted,
          targetDate: action.targetDate,
          dimensions: action.dimensions || [],
          attributes: action.attributes || []
        }))
      }))
    };

    console.log(`[GET /api/life-tree] Found ${goals.length} goals for user ${userId}`);

    return NextResponse.json(treeData);
  } catch (error: any) {
    console.error('Error fetching life tree data:', error.message);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      detail: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

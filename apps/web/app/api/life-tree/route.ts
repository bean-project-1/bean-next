import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Goal, GoalAction } from '@prisma/client';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'daniel@bean.app' }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Fetch User Goals with their Actions
    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      include: {
        actions: true
      }
    });

    // 2. Fetch latest LifeState for the total growth score
    const latestState = await prisma.lifeState.findFirst({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' }
    });

    // 3. Map to TreeData structure (Branches = Goals)
    const treeData = {
      growthScore: latestState?.lifeScore || 0,
      branches: goals.map((goal: Goal & { actions: GoalAction[] }) => ({
        id: goal.id,
        goal: goal.title,
        progress: goal.progress,
        leaves: goal.actions.map((action: GoalAction) => ({
          id: action.id,
          name: action.title,
          completed: action.isCompleted
        }))
      }))
    };

    return NextResponse.json(treeData);
  } catch (error: any) {
    console.error('Error fetching life tree data:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

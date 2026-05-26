import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {

  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Fetch User Goals with their Actions (Dynamic to user's actual goals)
    const goals = await (prisma as any).goal.findMany({
      where: { userId },
      include: {
        actions: {
          include: { tasks: true }
        }
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
        description: goal.description,
        deadline: goal.deadline,
        progress: goal.progress || 0,
        leaves: (goal.actions || []).map((action: any) => ({
          id: action.id,
          name: action.title,
          type: action.type,
          parentId: action.parentId,
          completed: action.isCompleted,
          startDate: action.startDate,
          targetDate: action.targetDate,
          estimatedHours: action.estimatedHours || 0,
          dimensions: action.dimensions || [],
          attributes: action.attributes || [],
          description: action.description,
          frequency: action.frequency,
          streak: action.streak,
          consistency: action.consistency,
          tasks: action.tasks || [],
          impact: action.impact || null
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
  }
}

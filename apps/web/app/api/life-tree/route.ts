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

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');

    const whereClause: any = { userId };
    if (spaceId && spaceId !== 'personal') {
      whereClause.spaceId = spaceId;
    } else {
      // Personal space = null spaceId OR spaceId doesn't exist yet in old docs
      whereClause.OR = [
        { spaceId: null },
        { spaceId: { isSet: false } }
      ];
    }

    // 1. Fetch User Goals with their Actions (Dynamic to user's actual goals)
    const goals = await (prisma as any).goal.findMany({
      where: whereClause,
      include: {
        actions: {
          include: { tasks: true }
        }
      }
    });

    // 2. Calculate organic growthScore based on goal progress
    const totalProgress = goals.reduce((acc: number, g: any) => acc + (g.progress || 0), 0);
    const growthScore = goals.length > 0 ? Math.round(totalProgress / goals.length) : 0;

    // 3. Map to TreeData structure (Branches = Goals)
    const treeData = {
      growthScore,
      branches: goals.map((goal: any) => ({
        id: goal.id,
        goal: goal.title,
        description: goal.description,
        deadline: goal.deadline,
        progress: goal.progress || 0,
        status: goal.status || 'active',
        resumeDate: goal.resumeDate || null,
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

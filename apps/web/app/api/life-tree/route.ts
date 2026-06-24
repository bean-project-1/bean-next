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

    const whereClause: any = {};
    if (spaceId && spaceId !== 'personal') {
      // Validate that the user has access to the space
      const member = await (prisma as any).spaceMember.findFirst({
        where: { spaceId, userId }
      });
      if (!member) {
        return NextResponse.json({ error: 'Unauthorized to access this space tree' }, { status: 403 });
      }
      whereClause.spaceId = spaceId;
    } else {
      whereClause.userId = userId;
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
          include: { 
            tasks: true,
            assignee: {
              select: { name: true, email: true, image: true }
            }
          }
        }
      }
    });

    // 2. Fetch User Base Commitments to calculate dynamic progress of mirror tasks
    const baseCommitments = await prisma.baseCommitment.findMany({
      where: { userId }
    });
    const commitmentMap = new Map(baseCommitments.map(bc => [bc.id, bc]));

    const calculateCommitmentSessions = (bc: any) => {
      if (!bc.startDate || !bc.endDate) return 10;
      const start = new Date(bc.startDate);
      const end = new Date(bc.endDate);
      let count = 0;
      const days = bc.daysOfWeek || [1, 2, 3, 4, 5];
      let current = new Date(start);
      while (current <= end) {
        if (days.includes(current.getDay())) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      return count === 0 ? 1 : count;
    };

    // Calculate organic growthScore based on goal progress
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
        leaves: (goal.actions || []).map((action: any) => {
          let resolvedType = action.type;
          let resolvedCompleted = action.isCompleted;
          let resolvedConsistency = action.consistency;
          let resolvedStreak = action.streak;
          let resolvedFrequency = action.frequency;

          if (action.baseCommitmentId) {
            const bc = commitmentMap.get(action.baseCommitmentId);
            if (bc) {
              resolvedType = 'habit'; // Show as habit in tree
              resolvedStreak = bc.streakCount || 0;
              resolvedFrequency = bc.frequency;
              const totalSessions = calculateCommitmentSessions(bc);
              const progressVal = Math.min(100, Math.round(((bc.completedCount || 0) / totalSessions) * 100));
              resolvedConsistency = progressVal / 100;
              resolvedCompleted = progressVal >= 100;

              // Self-healing check: Update GoalAction isCompleted in background if needed
              if (resolvedCompleted !== action.isCompleted) {
                prisma.goalAction.update({
                  where: { id: action.id },
                  data: { isCompleted: resolvedCompleted }
                }).catch(err => console.error("Error updating goalaction in background:", err));
              }
            }
          }

          return {
            id: action.id,
            name: action.title,
            type: resolvedType,
            parentId: action.parentId,
            completed: resolvedCompleted,
            startDate: action.startDate,
            targetDate: action.targetDate,
            estimatedHours: action.estimatedHours || 0,
            dimensions: action.dimensions || [],
            attributes: action.attributes || [],
            description: action.description,
            notes: action.notes,
            frequency: resolvedFrequency,
            streak: resolvedStreak,
            consistency: resolvedConsistency,
            tasks: action.tasks || [],
            impact: action.impact || null,
            assignee: action.assignee ? {
              name: action.assignee.name,
              email: action.assignee.email,
              image: action.assignee.image
            } : null
          };
        })
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

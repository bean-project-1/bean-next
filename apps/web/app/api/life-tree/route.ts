import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

    // 3. Map to TreeData structure (Branches = Goals)
    const branches = goals.map((goal: any) => {
      const leaves = (goal.actions || []).map((action: any) => {
        let resolvedType = action.type;
        let resolvedCompleted = action.isCompleted;
        let resolvedConsistency = action.consistency;
        let resolvedStreak = action.streak;
        let resolvedFrequency = action.frequency;
        let baseCommitmentTitle: string | null = null;
        let completedCount: number | null = null;
        let totalSessions: number | null = null;

        if (action.baseCommitmentId) {
          const bc = commitmentMap.get(action.baseCommitmentId);
          if (bc) {
            resolvedType = 'habit'; // Show as habit in tree
            resolvedStreak = bc.streakCount || 0;
            resolvedFrequency = bc.frequency;
            baseCommitmentTitle = bc.title;
            completedCount = bc.completedCount || 0;
            totalSessions = calculateCommitmentSessions(bc);
            const progressVal = Math.min(100, Math.round((completedCount / totalSessions) * 100));
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
          baseCommitmentId: action.baseCommitmentId || null,
          baseCommitmentTitle,
          completedCount,
          totalSessions,
          tasks: action.tasks || [],
          impact: action.impact || null,
          assignee: action.assignee ? {
            name: action.assignee.name,
            email: action.assignee.email,
            image: action.assignee.image
          } : null
        };
      });

      // Calculate dynamic progress of this branch based on completed leaves (non-phases)
      const nonPhaseLeaves = leaves.filter((l: any) => l.type !== 'phase');
      const totalNonPhases = nonPhaseLeaves.length;
      const completedNonPhases = nonPhaseLeaves.filter((l: any) => l.completed).length;
      const progress = totalNonPhases > 0 ? Math.round((completedNonPhases / totalNonPhases) * 100) : 0;

      // Self-healing check: Sync with Goal progress in database in background if it differs
      if (progress !== goal.progress) {
        prisma.goal.update({
          where: { id: goal.id },
          data: { progress }
        }).catch(err => console.error("Error updating goal progress in database:", err));
      }

      return {
        id: goal.id,
        goal: goal.title,
        description: goal.description,
        deadline: goal.deadline,
        progress,
        status: goal.status || 'active',
        resumeDate: goal.resumeDate || null,
        leaves
      };
    });

    // Calculate dynamic growthScore based on dynamic goal progress
    const totalProgress = branches.reduce((acc: number, b: any) => acc + b.progress, 0);
    const growthScore = branches.length > 0 ? Math.round(totalProgress / branches.length) : 0;

    const treeData = {
      growthScore,
      branches
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

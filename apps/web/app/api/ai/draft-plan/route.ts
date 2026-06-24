import { NextResponse } from 'next/server';
import { GoalService } from '@/services/goal-service';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goalData, previousDraft, revisionInstructions, spaceId } = body;
    
    const session = await auth();
    let userId = session?.user?.id;
    
    // Fallback for dev if no user found
    if (!userId) {
      const fallbackUser = await prisma.user.findFirst();
      userId = fallbackUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (!goalData || !goalData.goalTitle) {
      return NextResponse.json({ success: false, error: 'Missing goalData' }, { status: 400 });
    }

    const goalService = new GoalService();

    // Real DNA Starting Point Diagnosis
    const parsedGoal = await goalService.parseGoalWithAI(goalData.goalTitle, userId);
    // Overwrite constraints with the consensus values from the tool call
    parsedGoal.constraints = {
      timePerWeek: goalData.hoursPerWeek,
      targetDate: goalData.targetDate,
      budgetTotal: goalData.budget || 0
    } as any;

    // 1. Audit Resources (We no longer block the draft, we just log it)
    if (!previousDraft) {
      const audit = await goalService.auditGoalResources(parsedGoal, userId);
      if (!audit.isViable) {
        console.log(`[DraftPlan] Audit failed, but continuing generation to show draft. Reason: ${audit.renegotiationMessage}`);
        // We inject the auditor's warning into the constraints so the generator knows it's tight
        parsedGoal.constraints.auditWarning = audit.renegotiationMessage;
      }
    }

    // 2. Draft the Plan
    // Fetch actual DNA context
    const userDNA = await goalService.getUserDNA(userId);
    const dnaAnalysis = goalService.computeDNAAnalysis(parsedGoal.relevantDimensions || ['skills'], userDNA);

    // Fetch team context if spaceId is provided and not personal
    let teamContext = '';
    if (spaceId && spaceId !== 'personal') {
      const space = await prisma.space.findUnique({
        where: { id: spaceId },
        include: {
          members: {
            include: {
              user: {
                include: {
                  attributes: { include: { dimension: true } }
                }
              }
            }
          }
        }
      });
      if (space) {
        for (const member of space.members) {
          const u = member.user;
          const dna = u.attributes.map(a => `- ${a.dimension.label}: ${a.name}`).join('\n');
          teamContext += `Miembro: ${u.name} (ID: ${u.id})\nRol: ${member.role}\nADN:\n${dna || 'Sin ADN definido'}\n\n`;
        }
      }
    }

    const constraints = {
      ...parsedGoal.constraints,
      teamContext
    };

    const draft = await goalService.generateHierarchicalPlan(
      parsedGoal,
      dnaAnalysis,
      constraints,
      userId,
      previousDraft,
      revisionInstructions
    );

    // Return the JSON directly without saving
    return NextResponse.json({
      success: true,
      draft,
      auditFailed: false
    });

  } catch (error: any) {
    console.error('Error in POST /api/ai/draft-plan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}

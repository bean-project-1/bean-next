import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { GoalService } from '@/services/goal-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Text input is required' }, { status: 400 });
    }

    const goalService = new GoalService();

    // 2. Pipeline Execution
    console.log(`[GoalPipeline] Starting for user ${userId}: "${text}"`);
    
    // a. Parse intent
    const parsedGoal = await goalService.parseGoalWithAI(text);
    
    // b. Get user DNA
    const userDNA = await goalService.getUserDNA(userId);
    
    // c. Analyze readiness and gaps
    const dnaAnalysis = goalService.computeDNAAnalysis(parsedGoal.relevantDimensions, userDNA);
    
    // d. Generate plan structure
    const plan = await goalService.generateHierarchicalPlan(parsedGoal, dnaAnalysis, parsedGoal.constraints, userId);

    // 3. Persist in DB
    const result = await prisma.$transaction(async (tx) => {
      const finalConstraints = (parsedGoal.constraints || {}) as any;
      if (plan.analysis) {
        finalConstraints.analysis = plan.analysis;
      }

      // Create Goal
      const goal = await tx.goal.create({
        data: {
          userId,
          title: parsedGoal.title,
          description: parsedGoal.description,
          readinessScore: dnaAnalysis.readinessScore,
          constraints: finalConstraints,
          target: {
            dimensions: dnaAnalysis.targetDimensions,
            gap: dnaAnalysis.gap
          }
        }
      });

      // Create Actions (Phases first)
      for (const phaseData of plan.phases) {
        const phase = await tx.goalAction.create({
          data: {
            goalId: goal.id,
            title: phaseData.title,
            description: phaseData.description || null,
            type: 'phase',
            targetDate: phaseData.targetDate ? new Date(phaseData.targetDate) : null
          }
        });

        // Create Tasks for this phase
        if (phaseData.tasks) {
          for (const taskObj of phaseData.tasks) {
            const t = typeof taskObj === 'string' ? { name: taskObj, description: '', startDate: null, targetDate: null, dimensions: [], attributes: [] } : taskObj;
            await tx.goalAction.create({
              data: {
                goalId: goal.id,
                parentId: phase.id,
                title: t.name,
                description: t.description || null,
                type: 'task',
                startDate: t.startDate ? new Date(t.startDate) : null,
                targetDate: t.targetDate ? new Date(t.targetDate) : null,
                estimatedHours: t.estimatedHours || 0,
                dimensions: Array.isArray(t.dimensions) ? t.dimensions : [],
                attributes: Array.isArray(t.attributes) ? t.attributes : []
              }
            });
          }
        }

        // Create Milestone for this phase
        if (phaseData.milestone) {
          await tx.goalAction.create({
            data: {
              goalId: goal.id,
              parentId: phase.id,
              title: phaseData.milestone,
              type: 'milestone'
            }
          });
        }
      }

      // Helper function for fallback days
      const getFallbackDaysOfWeek = (days: any[], freq: any) => {
        if (Array.isArray(days) && days.length > 0) return days.map(Number);
        if (!freq) return [1, 2, 3, 4, 5];
        if (freq.type === 'daily') return [1, 2, 3, 4, 5, 6, 0];
        const val = freq.value || 1;
        if (val >= 7) return [1, 2, 3, 4, 5, 6, 0];
        if (val === 6) return [1, 2, 3, 4, 5, 6];
        if (val === 5) return [1, 2, 3, 4, 5];
        if (val === 4) return [1, 2, 4, 5];
        if (val === 3) return [1, 3, 5];
        if (val === 2) return [2, 4];
        return [1];
      };

      // Create Habits (directly under Goal) as BaseCommitments
      if (plan.habits) {
        for (const habitData of plan.habits) {
          let resolvedDims: string[] = [];
          if (habitData.dimensions && Array.isArray(habitData.dimensions)) {
            const dims = await tx.dimension.findMany({ where: { name: { in: habitData.dimensions } } });
            resolvedDims = dims.map(d => d.id);
          }

          await tx.baseCommitment.create({
            data: {
              userId,
              goalId: goal.id,
              title: habitData.title,
              description: habitData.description || null,
              type: habitData.type || 'routine',
              frequency: habitData.frequency || null,
              estimatedHours: habitData.estimatedHours || 0,
              attributes: Array.isArray(habitData.attributes) ? habitData.attributes : [],
              daysOfWeek: getFallbackDaysOfWeek(habitData.daysOfWeek, habitData.frequency),
              startDate: habitData.startDate ? new Date(habitData.startDate) : new Date(),
              endDate: habitData.endDate ? new Date(habitData.endDate) : (plan.phases?.[plan.phases.length - 1]?.targetDate ? new Date(plan.phases[plan.phases.length - 1].targetDate) : null),
              dimensionIds: resolvedDims,
              dimensions: {
                connect: resolvedDims.map(id => ({ id }))
              }
            }
          });
        }
      }

      // Create Continuous Projects (directly under Goal) as BaseCommitments
      if (plan.continuousProjects) {
        for (const cpData of plan.continuousProjects) {
          let resolvedDims: string[] = [];
          if (cpData.dimensions && Array.isArray(cpData.dimensions)) {
            const dims = await tx.dimension.findMany({ where: { name: { in: cpData.dimensions } } });
            resolvedDims = dims.map(d => d.id);
          }

          await tx.baseCommitment.create({
            data: {
              userId,
              goalId: goal.id,
              title: cpData.title,
              description: cpData.description || null,
              type: cpData.type || 'routine',
              estimatedHours: cpData.estimatedHours || 1.0,
              daysOfWeek: getFallbackDaysOfWeek(cpData.daysOfWeek, { type: 'weekly', value: cpData.daysOfWeek?.length || 3 }),
              startDate: cpData.startDate ? new Date(cpData.startDate) : new Date(),
              endDate: cpData.endDate ? new Date(cpData.endDate) : (plan.phases?.[plan.phases.length - 1]?.targetDate ? new Date(plan.phases[plan.phases.length - 1].targetDate) : null),
              dimensionIds: resolvedDims,
              dimensions: {
                connect: resolvedDims.map(id => ({ id }))
              }
            }
          });
        }
      }

      return { goalId: goal.id, planSummary: plan };
    });

    // 4. Return success response
    const gapDimension = Object.entries(dnaAnalysis.gap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'skills';
    
    return NextResponse.json({
      success: true,
      goalId: result.goalId,
      summary: {
        phases: plan.phases.length,
        tasks: plan.phases.reduce((acc: number, p: any) => acc + (p.tasks?.length || 0), 0),
        habits: plan.habits?.length || 0,
        insight: `Tu mayor brecha está en ${gapDimension}. Hemos estructurado el plan para fortalecer esta área.`
      }
    });

  } catch (error: any) {
    console.error('[GoalPipeline] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

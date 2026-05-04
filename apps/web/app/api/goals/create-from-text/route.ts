import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoalService } from '@/services/goal-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const userId = req.cookies.get('bean_user_id')?.value;
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
      // Create Goal
      const goal = await tx.goal.create({
        data: {
          userId,
          title: parsedGoal.title,
          description: parsedGoal.description,
          readinessScore: dnaAnalysis.readinessScore,
          constraints: parsedGoal.constraints || {},
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

      // Create Habits (directly under Goal)
      if (plan.habits) {
        for (const habitData of plan.habits) {
          await tx.goalAction.create({
            data: {
              goalId: goal.id,
              title: habitData.title,
              description: habitData.description || null,
              type: 'habit',
              frequency: habitData.frequency || null,
              estimatedHours: habitData.estimatedHours || 0,
              dimensions: Array.isArray(habitData.dimensions) ? habitData.dimensions : [],
              attributes: Array.isArray(habitData.attributes) ? habitData.attributes : []
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

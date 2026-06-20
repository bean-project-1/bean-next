import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan || !plan.title) {
      return NextResponse.json({ error: 'Falta el objeto plan estructurado para guardar' }, { status: 400 });
    }

    // Resolve 'career' dimension
    const dimension = await prisma.dimension.findFirst({
      where: { name: 'career' }
    });

    // Save Goal & GoalActions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Goal
      const goal = await tx.goal.create({
        data: {
          userId,
          title: plan.title,
          description: plan.description,
          dimensionId: dimension?.id || null,
          readinessScore: plan.readinessScore || 50,
          constraints: { gaps: plan.gaps || [] }
        }
      });

      // 2. Create Phases and Tasks
      if (plan.phases && Array.isArray(plan.phases)) {
        for (const phaseData of plan.phases) {
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + (phaseData.targetDaysFromNow || 30));

          const phase = await tx.goalAction.create({
            data: {
              goalId: goal.id,
              title: phaseData.title,
              description: phaseData.description || null,
              type: 'phase',
              targetDate
            }
          });

          // Create tasks under this phase
          if (phaseData.tasks && Array.isArray(phaseData.tasks)) {
            const tasksToCreate = phaseData.tasks.map((t: any) => {
              const taskTargetDate = new Date();
              taskTargetDate.setDate(taskTargetDate.getDate() + (t.daysFromStart || 10));

              return {
                goalId: goal.id,
                parentId: phase.id,
                title: t.name,
                description: t.description || null,
                type: 'task',
                estimatedHours: t.estimatedHours || 2,
                targetDate: taskTargetDate
              };
            });

            await tx.goalAction.createMany({
              data: tasksToCreate
            });
          }

          // Create milestone under phase if defined
          if (phaseData.milestone) {
            await tx.goalAction.create({
              data: {
                goalId: goal.id,
                parentId: phase.id,
                title: phaseData.milestone.title || 'Hito de Fase',
                description: phaseData.milestone.description || null,
                type: 'milestone',
                impact: {
                  evaluationType: phaseData.milestone.evaluationType || 'none',
                  evaluationInstructions: phaseData.milestone.evaluationInstructions || null
                }
              }
            });
          }
        }
      }

      // 3. Create Habits as Base Commitments
      if (plan.habits && Array.isArray(plan.habits)) {
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

        for (const h of plan.habits) {
          let resolvedDims: string[] = [];
          if (h.dimensions && Array.isArray(h.dimensions)) {
            const dims = await tx.dimension.findMany({ where: { name: { in: h.dimensions } } });
            resolvedDims = dims.map(d => d.id);
          }

          await tx.baseCommitment.create({
            data: {
              userId,
              goalId: goal.id,
              title: h.title,
              description: h.description || null,
              type: 'routine',
              frequency: h.frequency || { type: 'weekly', value: 1 },
              estimatedHours: h.estimatedHours || 1.0,
              daysOfWeek: getFallbackDaysOfWeek(h.daysOfWeek, h.frequency),
              startDate: new Date(),
              endDate: plan.phases?.[plan.phases.length - 1]?.targetDate ? new Date(plan.phases[plan.phases.length - 1].targetDate) : null,
              dimensionIds: resolvedDims,
              dimensions: {
                connect: resolvedDims.map(id => ({ id }))
              }
            }
          });
        }
      }

      return goal;
    });

    return NextResponse.json({ success: true, goal: result });
  } catch (error: any) {
    console.error('[POST /api/career/jobs/plan] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

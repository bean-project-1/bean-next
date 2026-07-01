// =======================================================
// BEAN — Onboarding Plan Saver API
// apps/web/app/api/onboarding/save-onboarding-plan/route.ts
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const data = await req.json();
    const { name, email, sleepHours, workSchedule, extractedAttributes, extractedInputs, planSummary } = data;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and Email are required' }, { status: 400 });
    }

    console.log(`[SaveOnboardingPlan] Saving onboarding profile & plan for user ${userId} (${email})`);

    // 2. Database Transaction
    await prisma.$transaction(async (tx) => {
      // a. Update User details
      await tx.user.update({
        where: { id: userId },
        data: {
          name,
          email, // sync email if needed
          onboardingCompleted: true,
          hasSeenTour: false // Trigger App Tour on first home visit
        }
      });

      // b. Query Dimensions
      const dimensions = await tx.dimension.findMany();
      const dimMap = new Map(dimensions.map(d => [d.name, d.id]));

      // c. Clear previous attributes if any
      await tx.userAttribute.deleteMany({ where: { userId } });
      await tx.baseCommitment.deleteMany({ where: { userId } });

      // d. Create user attributes from extracted attributes
      if (extractedAttributes && Array.isArray(extractedAttributes)) {
        for (const attr of extractedAttributes) {
          if (dimMap.has(attr.dimension)) {
            await tx.userAttribute.create({
              data: {
                userId,
                dimensionId: dimMap.get(attr.dimension)!,
                name: attr.name || attr.key || 'Atributo',
                category: attr.category || 'other',
                metadata: attr.metadata || {}
              }
            });
          }
        }
      }

      // e. Create user dimension inputs from extracted inputs
      if (extractedInputs && Array.isArray(extractedInputs)) {
        for (const input of extractedInputs) {
          if (dimMap.has(input.dimension)) {
            await tx.dimensionInput.create({
              data: {
                userId,
                dimensionId: dimMap.get(input.dimension)!,
                inputType: input.inputType || 'event',
                valueJson: input.valueJson || {},
                source: 'ai_onboarding'
              }
            });
          }
        }
      }

      // f. Create default Space
      let space = await tx.space.findFirst({
        where: {
          members: {
            some: { userId, role: 'owner' }
          }
        }
      });

      if (!space) {
        space = await tx.space.create({
          data: {
            name: 'Mi Árbol',
            description: 'Tu espacio principal para crecer',
            theme: 'green',
            members: {
              create: {
                userId,
                role: 'owner'
              }
            }
          }
        });
      }

      // g. Save Routine Commitments (Sleep & Work)
      const healthDim = dimensions.find(d => d.name === 'physical_health');
      await tx.baseCommitment.create({
        data: {
          userId,
          title: 'Dormir',
          type: 'routine',
          hoursPerDay: sleepHours || 8,
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Everyday
          dimensionIds: healthDim ? [healthDim.id] : [],
          spaceId: space.id,
          isActive: true,
        }
      });

      if (workSchedule && workSchedule !== 'none') {
        const careerDim = dimensions.find(d => d.name === 'career');
        const title = workSchedule === 'study' ? 'Estudio Principal' : 'Trabajo Principal';
        const hours = workSchedule === '9-5' ? 8 : (workSchedule === 'study' ? 6 : 4);
        const days = [1, 2, 3, 4, 5]; // Mon-Fri
        const type = workSchedule === 'study' ? 'study' : 'work';

        await tx.baseCommitment.create({
          data: {
            userId,
            title,
            type,
            hoursPerDay: hours,
            daysOfWeek: days,
            dimensionIds: careerDim ? [careerDim.id] : [],
            spaceId: space.id,
            isActive: true,
          }
        });
      }

      // h. Save the Generated Goal Tree
      if (planSummary) {
        // Create Goal
        const goal = await tx.goal.create({
          data: {
            userId,
            title: planSummary.name || 'Meta Principal',
            description: planSummary.description || '',
            readinessScore: 80,
            constraints: {},
            target: {
              dimensions: [],
              gap: 0
            }
          }
        });

        // Helper function for fallback days
        const getFallbackDaysOfWeek = (days: any[], freq: any) => {
          if (Array.isArray(days) && days.length > 0) {
            const parsed = days.map(Number).filter(n => !isNaN(n) && n !== null && n !== undefined);
            if (parsed.length > 0) return parsed;
          }
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

        const commitmentTitleToId = new Map<string, string>();

        // Create Habits as BaseCommitments under this goal
        if (planSummary.habits && Array.isArray(planSummary.habits)) {
          for (const habitData of planSummary.habits) {
            let resolvedDims: string[] = [];
            if (habitData.dimensions && Array.isArray(habitData.dimensions)) {
              const dims = await tx.dimension.findMany({ where: { name: { in: habitData.dimensions } } });
              resolvedDims = dims.map(d => d.id);
            }

            const bc = await tx.baseCommitment.create({
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
                endDate: habitData.endDate ? new Date(habitData.endDate) : (planSummary.phases?.[planSummary.phases.length - 1]?.targetDate ? new Date(planSummary.phases[planSummary.phases.length - 1].targetDate) : null),
                dimensionIds: resolvedDims,
                dimensions: {
                  connect: resolvedDims.map(id => ({ id }))
                }
              }
            });
            commitmentTitleToId.set(habitData.title.trim().toLowerCase(), bc.id);
          }
        }

        // Create Continuous Projects
        if (planSummary.continuousProjects && Array.isArray(planSummary.continuousProjects)) {
          for (const cpData of planSummary.continuousProjects) {
            let resolvedDims: string[] = [];
            if (cpData.dimensions && Array.isArray(cpData.dimensions)) {
              const dims = await tx.dimension.findMany({ where: { name: { in: cpData.dimensions } } });
              resolvedDims = dims.map(d => d.id);
            }

            const bc = await tx.baseCommitment.create({
              data: {
                userId,
                goalId: goal.id,
                title: cpData.title,
                description: cpData.description || null,
                type: cpData.type || 'routine',
                estimatedHours: cpData.estimatedHours || 1.0,
                daysOfWeek: getFallbackDaysOfWeek(cpData.daysOfWeek, { type: 'weekly', value: cpData.daysOfWeek?.length || 3 }),
                startDate: cpData.startDate ? new Date(cpData.startDate) : new Date(),
                endDate: cpData.endDate ? new Date(cpData.endDate) : (planSummary.phases?.[planSummary.phases.length - 1]?.targetDate ? new Date(planSummary.phases[planSummary.phases.length - 1].targetDate) : null),
                dimensionIds: resolvedDims,
                dimensions: {
                  connect: resolvedDims.map(id => ({ id }))
                }
              }
            });
            commitmentTitleToId.set(cpData.title.trim().toLowerCase(), bc.id);
          }
        }

        // Create Actions (Phases, Tasks, Milestones)
        if (planSummary.phases && Array.isArray(planSummary.phases)) {
          for (const phaseData of planSummary.phases) {
            const phase = await tx.goalAction.create({
              data: {
                goalId: goal.id,
                title: phaseData.title || phaseData.name || 'Fase',
                description: phaseData.description || null,
                type: 'phase',
                targetDate: phaseData.targetDate ? new Date(phaseData.targetDate) : null
              }
            });

            // Create Tasks inside Phase
            if (phaseData.tasks && Array.isArray(phaseData.tasks)) {
              for (const taskObj of phaseData.tasks) {
                const t = typeof taskObj === 'string' ? { name: taskObj, description: '', startDate: null, targetDate: null, dimensions: [], attributes: [] } : taskObj;
                const taskTitle = t.name || t.title;
                const matchedCommitmentId = commitmentTitleToId.get(taskTitle.trim().toLowerCase()) || null;

                await tx.goalAction.create({
                  data: {
                    goalId: goal.id,
                    parentId: phase.id,
                    title: taskTitle,
                    description: t.description || null,
                    type: 'task',
                    startDate: t.startDate ? new Date(t.startDate) : null,
                    targetDate: t.targetDate ? new Date(t.targetDate) : null,
                    estimatedHours: t.estimatedHours || 0,
                    dimensions: Array.isArray(t.dimensions) ? t.dimensions : [],
                    attributes: Array.isArray(t.attributes) ? t.attributes : [],
                    baseCommitmentId: matchedCommitmentId
                  }
                });
              }
            }

            // Create Milestone for Phase
            if (phaseData.milestone) {
              const mTitle = typeof phaseData.milestone === 'object' && phaseData.milestone !== null
                ? (phaseData.milestone.title || phaseData.milestone.name || 'Hito')
                : String(phaseData.milestone);

              const mDesc = typeof phaseData.milestone === 'object' && phaseData.milestone !== null
                ? (phaseData.milestone.description || phaseData.milestone.evaluationInstructions || null)
                : null;

              await tx.goalAction.create({
                data: {
                  goalId: goal.id,
                  parentId: phase.id,
                  title: mTitle,
                  description: mDesc,
                  type: 'milestone'
                }
              });
            }
          }
        }
      }
    }, {
      timeout: 15000
    });

    console.log(`[SaveOnboardingPlan] Successfully saved onboarding profile & plan for user ${userId}`);

    return NextResponse.json({
      success: true
    });

  } catch (err: any) {
    console.error('[API Onboarding Save-Onboarding-Plan]', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save onboarding plan and profile',
      detail: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

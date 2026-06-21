import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' });
    }

    const { goalId, draftPlan } = await req.json();

    if (!goalId || !draftPlan) {
      return NextResponse.json({ success: false, error: 'Missing required fields' });
    }

    // Verify ownership
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        actions: { include: { tasks: true } }
      }
    });

    if (!goal || goal.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Goal not found or access denied' });
    }

    // Extract all incoming IDs
    const incomingActionIds = new Set<string>();
    const incomingTaskIds = new Set<string>();

    for (const phase of (draftPlan.phases || [])) {
      if (phase.id) incomingActionIds.add(phase.id);
      
      // The phase might have a milestone, we usually recreate them or keep them if they had an ID (but milestones don't have explicit IDs in our draft json unless passed)
      // Actually our draft JSON only maps phase.id and task.id, milestone is just an object inside phase. 

      for (const t of (phase.tasks || [])) {
        if (t.id) incomingActionIds.add(t.id);

        for (const st of (t.subTasks || [])) {
          if (st.id) incomingTaskIds.add(st.id);
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete what is NOT in the new plan, AND is NOT completed
      const existingActions = goal.actions;
      
      for (const action of existingActions) {
        // If it's a phase or task that the user deleted from the UI, and it's not completed:
        if (!incomingActionIds.has(action.id) && !action.isCompleted && action.type !== 'milestone') {
          await tx.goalAction.delete({ where: { id: action.id } });
        } else {
          // It is either in the incoming plan, OR it is completed, OR it is a milestone.
          // For its subTasks:
          for (const task of action.tasks) {
            if (!incomingTaskIds.has(task.id) && !task.isCompleted) {
              await tx.task.delete({ where: { id: task.id } });
            }
          }
        }
      }

      // We also need to clear milestones for phases that will be updated if they are not completed, so we can re-create them.
      // Easiest is to delete incomplete milestones, then re-create them.
      await tx.goalAction.deleteMany({
        where: {
          goalId: goal.id,
          type: 'milestone',
          isCompleted: false
        }
      });

      // 2. Upsert Phases and Tasks
      for (const phaseData of (draftPlan.phases || [])) {
        let phaseId = phaseData.id;

        // Ignore completed elements in terms of updating their core logic, but we still process them.
        if (phaseId && phaseData.isCompleted) {
          // It's completed and we preserve it. 
          // Do nothing to the phase itself.
        } else if (phaseId) {
          // Update existing phase
          await tx.goalAction.update({
            where: { id: phaseId },
            data: {
              title: phaseData.title,
              description: phaseData.description || null,
              targetDate: phaseData.targetDate ? new Date(phaseData.targetDate) : null,
            }
          });
        } else {
          // Create new phase
          const createdPhase = await tx.goalAction.create({
            data: {
              goalId: goal.id,
              title: phaseData.title,
              description: phaseData.description || null,
              type: 'phase',
              targetDate: phaseData.targetDate ? new Date(phaseData.targetDate) : null,
            }
          });
          phaseId = createdPhase.id;
        }

        // Handle Phase Milestone (re-create if not completed)
        if (phaseData.milestone && phaseId) {
          // Only create if we didn't just skip the phase because it's completed.
          // Actually, if a phase is completed, its milestone is also completed, so we didn't delete it.
          if (!phaseData.isCompleted) {
            const m = phaseData.milestone;
            const milestoneTitle = typeof m === 'string' ? m : (m.title || 'Hito Final');
            const milestoneDesc = typeof m === 'object' ? m.description : null;
            const evaluationType = typeof m === 'object' ? (m.evaluationType || 'none') : 'none';
            const evaluationInstructions = typeof m === 'object' ? m.evaluationInstructions : null;

            await tx.goalAction.create({
              data: {
                goalId: goal.id,
                parentId: phaseId,
                title: milestoneTitle,
                description: milestoneDesc,
                type: 'milestone',
                impact: {
                  evaluationType,
                  evaluationInstructions
                }
              }
            });
          }
        }

        // Handle Tasks
        if (phaseData.tasks && phaseData.tasks.length > 0) {
          for (const t of phaseData.tasks) {
            let taskId = t.id;

            if (taskId && t.isCompleted) {
              // Preserve as is
            } else if (taskId) {
              // Update Task
              await tx.goalAction.update({
                where: { id: taskId },
                data: {
                  title: t.name,
                  description: t.description || null,
                  startDate: t.startDate ? new Date(t.startDate) : null,
                  targetDate: t.targetDate ? new Date(t.targetDate) : null,
                  estimatedHours: t.estimatedHours || 0,
                  effort: t.effort || null,
                  notes: t.notes || null,
                  parentId: phaseId // Move to correct phase just in case
                }
              });
            } else {
              // Create Task
              const createdTask = await tx.goalAction.create({
                data: {
                  goalId: goal.id,
                  parentId: phaseId,
                  title: t.name,
                  description: t.description || null,
                  type: 'task',
                  startDate: t.startDate ? new Date(t.startDate) : null,
                  targetDate: t.targetDate ? new Date(t.targetDate) : null,
                  estimatedHours: t.estimatedHours || 0,
                  effort: t.effort || null,
                  notes: t.notes || null,
                  dimensions: t.dimensions || [],
                  attributes: t.attributes || []
                }
              });
              taskId = createdTask.id;
            }

            // Handle SubTasks
            if (t.subTasks && t.subTasks.length > 0) {
              for (const st of t.subTasks) {
                if (st.id && st.isCompleted) {
                  // Preserve
                } else if (st.id) {
                  await tx.task.update({
                    where: { id: st.id },
                    data: {
                      title: st.name,
                      description: st.description || null,
                      estimatedHours: st.estimatedHours || 0,
                      goalActionId: taskId
                    }
                  });
                } else {
                  await tx.task.create({
                    data: {
                      goalActionId: taskId,
                      title: st.name,
                      description: st.description || null,
                      estimatedHours: st.estimatedHours || 0
                    }
                  });
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Goal updated successfully' });

  } catch (error: any) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

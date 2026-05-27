// =======================================================
// BEAN — API Route: GET /api/schedule
// Fetches all time-bound activities across all goals
// =======================================================
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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Fetch Goals with time-bound Actions and Tasks
    const goals = await prisma.goal.findMany({
      where: { userId, status: 'active' },
      include: {
        actions: {
          include: { tasks: true }
        }
      }
    });

    // 2. Fetch Base Commitments (Work/Study/Routines)
    const baseCommitments = await prisma.baseCommitment.findMany({
      where: { userId, isActive: true },
      include: { dimension: true }
    });

    const events: any[] = [];

    // Project Base Commitments over the next 30 days
    const horizonStart = new Date(startOfToday);
    for (let i = 0; i < 30; i++) {
      const d = new Date(horizonStart);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();
      const dateKey = d.toISOString().split('T')[0];

      baseCommitments.forEach(bc => {
        if (bc.daysOfWeek.includes(dayOfWeek)) {
          events.push({
            id: `${bc.id}-${dateKey}`,
            title: bc.title,
            description: `Compromiso recurrente (${bc.type})`,
            date: d.toISOString(),
            startTime: bc.startTime,
            endTime: bc.endTime,
            type: bc.type,
            estimatedHours: bc.hoursPerDay + ((bc as any).commuteHours || 0),
            status: 'commitment',
            goalTitle: 'Base DNA',
            itemType: 'commitment',
            dimensionName: bc.dimension?.label || 'General'
          });
        }
      });
    }

    goals.forEach(goal => {
      goal.actions.forEach(action => {
        // Handle Action (Phase, Habit, Milestone, Task)
        if (action.targetDate) {
          events.push({
            id: action.id,
            title: action.title,
            description: action.description,
            startDate: action.startDate,
            date: action.targetDate,
            type: action.type,
            estimatedHours: action.estimatedHours || 0,
            status: action.isCompleted ? 'completed' : 'pending',
            goalId: goal.id,
            goalTitle: goal.title,
            dimensions: action.dimensions || [],
            attributes: action.attributes || [],
            tasks: action.tasks || [],
            itemType: 'action'
          });
        }

        // Handle Habits (Daily/Weekly)
        if (action.type === 'habit' && action.frequency) {
          events.push({
            id: action.id,
            title: action.title,
            description: action.description,
            type: 'habit',
            frequency: action.frequency,
            estimatedHours: action.estimatedHours || 0,
            status: 'habit',
            goalId: goal.id,
            goalTitle: goal.title,
            dimensions: action.dimensions || [],
            attributes: action.attributes || [],
            tasks: action.tasks || [],
            itemType: 'habit'
          });
        }

        // Handle Sub-tasks directly if they have dates
        action.tasks.forEach(task => {
          if (task.endDate || task.startDate) {
            events.push({
              id: task.id,
              title: task.title,
              description: task.description,
              startDate: task.startDate,
              date: task.endDate || task.startDate,
              type: 'subtask',
              estimatedHours: task.estimatedHours || 0,
              status: task.isCompleted ? 'completed' : 'pending',
              goalId: goal.id,
              goalTitle: goal.title,
              dimensions: [],
              attributes: [],
              tasks: [],
              itemType: 'task'
            });
          }
        });
      });
    });

    // 3. Fetch DailyTasks
    const dailyTasks = await prisma.dailyTask.findMany({
      where: { userId }
    });

    dailyTasks.forEach(task => {
      // Logic for overdue tasks: if incomplete and date is in the past, treat as today
      let targetDate = new Date(task.date);
      let isOverdue = false;

      if (!task.isCompleted && targetDate < startOfToday) {
        targetDate = new Date(startOfToday); // Carry over to today
        isOverdue = true;
      }

      events.push({
        id: task.id,
        title: task.title,
        description: isOverdue ? 'Retrasada de un día anterior' : 'Tarea rápida',
        date: targetDate.toISOString(),
        type: 'daily',
        estimatedHours: task.estimatedHours || 0,
        status: task.isCompleted ? 'completed' : 'pending',
        itemType: 'daily',
        isOverdue
      });
    });

    // 4. Fetch Anchored Post-Its
    const anchoredPostIts = await prisma.postIt.findMany({
      where: { userId, anchoredDate: { not: null } }
    });

    anchoredPostIts.forEach(postIt => {
      events.push({
        id: postIt.id,
        title: postIt.content,
        description: 'Nota rápida',
        date: postIt.anchoredDate!.toISOString(),
        type: 'post-it',
        estimatedHours: 0,
        status: 'pending',
        itemType: 'post-it',
        originalPostIt: postIt
      });
    });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('[GET /api/schedule] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

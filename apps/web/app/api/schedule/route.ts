// =======================================================
// BEAN — API Route: GET /api/schedule
// Fetches all time-bound activities across all goals
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Fetch Goals with time-bound Actions and Tasks
    const goals = await prisma.goal.findMany({
      where: { userId, status: 'active' },
      include: {
        actions: {
          include: { tasks: true }
        }
      }
    });

    const events: any[] = [];

    goals.forEach(goal => {
      goal.actions.forEach(action => {
        // Handle Action (Phase, Habit, Milestone, Task)
        if (action.targetDate) {
          events.push({
            id: action.id,
            title: action.title,
            description: action.description,
            date: action.targetDate,
            type: action.type,
            estimatedHours: action.estimatedHours || 0,
            status: action.isCompleted ? 'completed' : 'pending',
            goalId: goal.id,
            goalTitle: goal.title,
            itemType: 'action'
          });
        }

        // Handle Habits (Daily/Weekly)
        if (action.type === 'habit' && action.frequency) {
          // For habits, we could generate instances for the current month
          // For now, let's just mark them as "Today" or recurring metadata
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
            itemType: 'habit'
          });
        }

        // Handle Sub-tasks
        action.tasks.forEach(task => {
          if (task.endDate || task.startDate) {
            events.push({
              id: task.id,
              title: task.title,
              description: task.description,
              date: task.endDate || task.startDate,
              type: 'subtask',
              status: task.isCompleted ? 'completed' : 'pending',
              goalId: goal.id,
              goalTitle: goal.title,
              itemType: 'task'
            });
          }
        });
      });
    });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('[GET /api/schedule] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

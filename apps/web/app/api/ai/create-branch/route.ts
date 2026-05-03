// =======================================================
// BEAN — API Route: POST /api/ai/create-branch
// Creates a Goal + GoalActions from AI plan data
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { goal, dimensionName, activities } = await req.json();

    if (!goal || !activities?.length) {
      return NextResponse.json({ success: false, error: 'Missing goal or activities' }, { status: 400 });
    }

    // Find matching dimension (fuzzy match on label)
    const dimensions = await prisma.dimension.findMany();
    const matchedDimension = dimensions.find(d =>
      d.label.toLowerCase().includes(dimensionName?.toLowerCase() ?? '') ||
      d.name.toLowerCase().includes(dimensionName?.toLowerCase() ?? '')
    );

    // Create the goal (branch)
    const newGoal = await prisma.goal.create({
      data: {
        userId,
        title: goal,
        dimensionId: matchedDimension?.id ?? null,
        status: 'active',
        progress: 0
      }
    });

    // Create each activity (leaf)
    for (const activity of activities) {
      await prisma.goalAction.create({
        data: {
          goalId: newGoal.id,
          title: activity.title,
          type: 'task', // Default type for AI actions
          description: activity.description ?? '',
          isCompleted: false,
          dimensions: matchedDimension ? [matchedDimension.name] : [],
          attributes: [],
        }
      });
    }

    return NextResponse.json({
      success: true,
      goalId: newGoal.id,
      message: `Meta "${goal}" creada con ${activities.length} actividades.`
    });
  } catch (error: any) {
    console.error('[POST /api/ai/create-branch] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

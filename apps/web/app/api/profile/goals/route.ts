import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await req.json();
    const { title, description, purpose, dimensions, spaceId } = data;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Assign to a space only if spaceId is provided and valid
    const finalSpaceId = (spaceId && spaceId !== 'personal') ? spaceId : null;

    if (finalSpaceId) {
      // Validate the user has access to the space
      const member = await (prisma as any).spaceMember.findFirst({
        where: { spaceId: finalSpaceId, userId }
      });
      if (!member) {
        return NextResponse.json({ error: 'Unauthorized to add goals to this space' }, { status: 403 });
      }
    }

    const newGoal = await (prisma as any).goal.create({
      data: {
        userId,
        spaceId: finalSpaceId,
        title,
        description: description || '',
        purpose: purpose || '',
        dimensions: dimensions || [],
        progress: 0,
        status: 'active',
      }
    });

    console.log(`[POST /api/profile/goals] Created goal ${newGoal.id} for user ${userId} in space ${finalSpaceId || 'personal'}`);

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error: any) {
    console.error('Error creating goal:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 });
  }
}

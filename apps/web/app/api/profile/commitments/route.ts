import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const commitments = await prisma.baseCommitment.findMany({
      where: { userId },
      include: { dimension: true }
    });

    return NextResponse.json({ success: true, commitments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { title, type, daysOfWeek, hoursPerDay, commuteHours, startTime, endTime, dimensionId } = body;

    let validDimensionId = undefined;
    if (dimensionId) {
      const dim = await prisma.dimension.findUnique({ where: { name: dimensionId } });
      if (dim) validDimensionId = dim.id;
    }

    const commitment = await prisma.baseCommitment.create({
      data: {
        userId,
        title,
        type,
        daysOfWeek,
        hoursPerDay,
        commuteHours,
        startTime,
        endTime,
        dimensionId: validDimensionId
      }
    });

    return NextResponse.json({ success: true, commitment });
  } catch (error: any) {
    console.error('[BaseCommitment POST Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

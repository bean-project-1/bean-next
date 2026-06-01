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
      include: { dimensions: true }
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
    const { title, type, daysOfWeek, hoursPerDay, commuteHours, startTime, endTime, dimensionIds } = body;

    let validDimensionIds: string[] = [];
    if (dimensionIds && Array.isArray(dimensionIds)) {
      const dims = await prisma.dimension.findMany({ where: { name: { in: dimensionIds } } });
      validDimensionIds = dims.map(d => d.id);
    } else if (body.dimensionId) {
      // Fallback for old requests
      const dim = await prisma.dimension.findUnique({ where: { name: body.dimensionId } });
      if (dim) validDimensionIds = [dim.id];
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
        dimensionIds: validDimensionIds
      }
    });

    return NextResponse.json({ success: true, commitment });
  } catch (error: any) {
    console.error('[BaseCommitment POST Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

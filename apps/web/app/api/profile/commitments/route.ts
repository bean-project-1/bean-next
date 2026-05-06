import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
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
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { title, type, daysOfWeek, hoursPerDay, startTime, endTime, dimensionId } = body;

    const commitment = await prisma.baseCommitment.create({
      data: {
        userId,
        title,
        type,
        daysOfWeek,
        hoursPerDay,
        startTime,
        endTime,
        dimensionId
      }
    });

    return NextResponse.json({ success: true, commitment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

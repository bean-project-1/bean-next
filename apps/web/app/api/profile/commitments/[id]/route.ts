import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    await prisma.baseCommitment.delete({
      where: { 
        id,
        userId // Security: Ensure it belongs to the user
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { title, type, daysOfWeek, hoursPerDay, commuteHours, startTime, endTime, dimensionId } = body;

    let validDimensionId = null; // Use null to unset if empty
    if (dimensionId) {
      const dim = await prisma.dimension.findUnique({ where: { name: dimensionId } });
      if (dim) validDimensionId = dim.id;
    }

    const commitment = await prisma.baseCommitment.update({
      where: { id, userId },
      data: {
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
    console.error('[BaseCommitment PUT Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

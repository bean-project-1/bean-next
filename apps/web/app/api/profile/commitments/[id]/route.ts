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
    const { title, type, daysOfWeek, hoursPerDay, commuteHours, startTime, endTime, dimensionIds } = body;

    let validDimensionIds: string[] | undefined = undefined; 
    
    if (dimensionIds && Array.isArray(dimensionIds)) {
      const dims = await prisma.dimension.findMany({ where: { name: { in: dimensionIds } } });
      validDimensionIds = dims.map(d => d.id);
    } else if (body.dimensionId) {
      // Fallback
      const dim = await prisma.dimension.findUnique({ where: { name: body.dimensionId } });
      if (dim) validDimensionIds = [dim.id];
    } else if (dimensionIds === null || body.dimensionId === null) {
      validDimensionIds = []; // Clear them
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
        ...(validDimensionIds !== undefined ? { dimensionIds: validDimensionIds } : {})
      }
    });

    return NextResponse.json({ success: true, commitment });
  } catch (error: any) {
    console.error('[BaseCommitment PUT Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id: seedId } = await context.params;

    // Verify ownership
    const existing = await prisma.incubatorSeed.findUnique({ where: { id: seedId } });
    if (!existing || existing.userId !== session.user.id) {
      return new NextResponse('Not found', { status: 404 });
    }

    const updated = await prisma.incubatorSeed.update({
      where: { id: seedId },
      data: {
        ...body, // Includes partial updates like scores, messages, clouds, proposal
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ seed: updated });
  } catch (error) {
    console.error('Error updating seed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id: seedId } = await context.params;

    // Verify ownership
    const existing = await prisma.incubatorSeed.findUnique({ where: { id: seedId } });
    if (!existing || existing.userId !== session.user.id) {
      return new NextResponse('Not found', { status: 404 });
    }

    await prisma.incubatorSeed.delete({
      where: { id: seedId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting seed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

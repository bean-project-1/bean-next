import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const postIt = await prisma.postIt.update({
      where: { id, userId }, // Ensure user owns the post-it
      data: {
        content: body.content,
        color: body.color,
        x: body.x,
        y: body.y,
        rotation: body.rotation,
        zIndex: body.zIndex,
        isPinned: body.isPinned,
        anchoredDate: body.anchoredDate !== undefined ? (body.anchoredDate ? new Date(body.anchoredDate) : null) : undefined
      }
    });

    return NextResponse.json({ success: true, postIt });
  } catch (error: any) {
    console.error(`[PATCH /api/schedule/post-its] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.postIt.delete({
      where: { id, userId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`[DELETE /api/schedule/post-its] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

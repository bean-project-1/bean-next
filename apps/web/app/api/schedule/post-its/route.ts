import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const postIts = await prisma.postIt.findMany({
      where: { userId, anchoredDate: null },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, postIts });
  } catch (error: any) {
    console.error('[GET /api/schedule/post-its] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    
    const postIt = await prisma.postIt.create({
      data: {
        userId,
        content: body.content || '',
        color: body.color || 'yellow',
        x: body.x || 0,
        y: body.y || 0,
        rotation: body.rotation || 0,
        zIndex: body.zIndex || 0,
        isPinned: body.isPinned || false,
        anchoredDate: body.anchoredDate ? new Date(body.anchoredDate) : null
      }
    });

    return NextResponse.json({ success: true, postIt });
  } catch (error: any) {
    console.error('[POST /api/schedule/post-its] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

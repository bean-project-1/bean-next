// =======================================================
// BEAN — API Route: GET + DELETE /api/ai/chat
// Retrieves or deletes chat sessions. (POST moved to smart-planner)
// =======================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const context = searchParams.get('context') ?? 'insights';
    const sessionId = searchParams.get('sessionId');

    let session = null;
    
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
    }

    if (!session) {
      session = await prisma.chatSession.findFirst({
        where: { userId, context },
        orderBy: { updatedAt: 'desc' },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, context },
        include: { messages: true }
      });
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error('GET /api/ai/chat Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const context = searchParams.get('context') ?? 'global';

    // Find all sessions for this user and context to clear duplicate/historical sessions
    const sessions = await prisma.chatSession.findMany({
      where: { userId, context },
      select: { id: true }
    });

    const sessionIds = sessions.map(s => s.id);

    if (sessionIds.length > 0) {
      await prisma.chatMessage.deleteMany({
        where: { sessionId: { in: sessionIds } }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/ai/chat Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// =======================================================
// BEAN — API Route: GET + POST /api/ai/chat
// Permanent AI Coach chat with DB persistence
// =======================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ChatCoachService } from '@/services/chat-coach-service';

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

    const chatCoachService = new ChatCoachService();
    const session = await chatCoachService.getOrCreateSession(userId, undefined, context);

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error('GET /api/ai/chat Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { sessionId, message, context, draftPlan, attachedContext } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 });
    }

    const chatCoachService = new ChatCoachService();
    const byokKey = req.cookies.get('bean_byok_key')?.value;
    const byokProvider = req.cookies.get('bean_byok_provider')?.value;
    const result = await chatCoachService.generateResponse(userId, sessionId, message, context, draftPlan, byokKey, byokProvider, attachedContext);

    return NextResponse.json({
      success: true,
      reply: result.reply,
      branchData: result.branchData,
      triggerRevision: result.triggerRevision,
      saveNote: result.saveNote,
      sessionId: result.sessionId
    });
  } catch (error: any) {
    console.error('POST /api/ai/chat Error:', error?.message ?? error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      detail: process.env.NODE_ENV !== 'production' ? (error?.message ?? String(error)) : undefined
    }, { status: 500 });
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

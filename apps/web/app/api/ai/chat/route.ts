// =======================================================
// BEAN — API Route: GET + POST /api/ai/chat
// Permanent AI Coach chat with DB persistence
// =======================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
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

    const { sessionId, message, context, draftPlan } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 });
    }

    const chatCoachService = new ChatCoachService();
    const byokKey = req.cookies.get('bean_byok_key')?.value;
    const result = await chatCoachService.generateResponse(userId, sessionId, message, context, draftPlan, byokKey);

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

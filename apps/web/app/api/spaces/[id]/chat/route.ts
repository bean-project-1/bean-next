import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '../../../../../lib/prisma';
import { ChatCoachService } from '../../../../../services/chat-coach-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: spaceId } = resolvedParams;
    
    // For MVP, we fetch all messages for the space
    const messages = await prisma.spaceMessage.findMany({
      where: { spaceId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true, avatarUrl: true, id: true } }
      }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: spaceId } = resolvedParams;
    const { content, mentions } = await req.json();

    if (!content.trim()) return NextResponse.json({ error: 'Empty message' }, { status: 400 });

    // Save user message
    const userMessage = await prisma.spaceMessage.create({
      data: {
        spaceId,
        userId: session.user.id,
        role: 'user',
        content,
        mentions: mentions || []
      },
      include: {
        user: { select: { name: true, avatarUrl: true, id: true } }
      }
    });

    const isBeanMentioned = mentions && mentions.includes('bean');

    if (isBeanMentioned) {
      const coachService = new ChatCoachService();
      
      // Get AI keys if set
      const byokKey = req.cookies.get('user_ai_key')?.value;
      const byokProvider = req.cookies.get('user_ai_provider')?.value;

      await coachService.generateGroupResponse(
        spaceId,
        session.user.id,
        content,
        byokKey,
        byokProvider
      );
    }

    return NextResponse.json({ success: true, message: userMessage });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

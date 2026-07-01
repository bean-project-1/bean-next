import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '../../../../../lib/prisma';
import { groupGoalGraph } from '../../../../../services/group-goal-graph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: spaceId } = resolvedParams;
    
    if (!/^[0-9a-fA-F]{24}$/.test(spaceId)) {
      return NextResponse.json([]);
    }
    
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

    if (!/^[0-9a-fA-F]{24}$/.test(spaceId)) {
      return NextResponse.json({ error: 'Invalid space ID' }, { status: 400 });
    }

    const { content, mentions, draftPlan, attachedContext, smartCriteria } = await req.json();

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

    if (!isBeanMentioned) {
      // Just return the user message for regular chat
      return NextResponse.json({ success: true, message: userMessage });
    }

    // AI logic via SSE
    const byokKey = req.cookies.get('user_ai_key')?.value;
    const byokProvider = req.cookies.get('user_ai_provider')?.value;

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        members: {
          include: {
            user: {
              include: {
                attributes: { include: { dimension: true } }
              }
            }
          }
        }
      }
    });

    if (!space) throw new Error('Space not found');

    let teamContext = '';
    for (const member of space.members) {
      const u = member.user;
      const dna = u.attributes.map(a => `- ${a.dimension.label}: ${a.name}`).join('\n');
      teamContext += `Miembro: ${u.name} (ID: ${u.id})\nRol: ${member.role}\nADN:\n${dna || 'Sin ADN definido'}\n\n`;
    }

    // Fetch recent space messages for context
    const history = await prisma.spaceMessage.findMany({
      where: { spaceId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } }
    });

    const graphMessages = history.reverse().map(m => 
      m.role === 'user' ? new HumanMessage(`[${m.user?.name || 'Usuario'}]: ${m.content}`) : new AIMessage(m.content)
    );

    const configData = { byokKey, byokProvider };
    const initialState = {
      messages: graphMessages,
      smartCriteria: smartCriteria || {
        specific: 'Pending',
        measurable: 'Pending',
        achievable: 'Pending',
        relevant: 'Pending',
        timeBound: 'Pending'
      },
      currentPhase: draftPlan ? 'REVISOR' : 'COACH',
      actionPlan: draftPlan || null,
      attachedContext: attachedContext || null,
      teamContext,
      config: configData
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (event: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
        };

        try {
          emit({ type: 'step', step: 1, label: 'Coach analizando requerimientos del equipo...', status: 'active' });

          const runner = await groupGoalGraph.stream(initialState, { 
            streamMode: "values" 
          });

          let finalState: any = null;
          let emittedEstratega = false;
          let emittedCronologista = false;

          for await (const s of (runner as any)) {
            const state = s as any;
            finalState = state;
            if (state.currentPhase === 'ESTRATEGA' && !emittedEstratega) {
              emit({ type: 'step', step: 1, label: 'Requerimientos validados', status: 'done' });
              emit({ type: 'step', step: 2, label: 'Estratega coordinando fases...', status: 'active' });
              emittedEstratega = true;
            }
            if (state.currentPhase === 'CRONOLOGISTA' && !emittedCronologista) {
              emit({ type: 'step', step: 2, label: 'Fases generadas', status: 'done' });
              emit({ type: 'step', step: 3, label: 'Asignando tareas al equipo...', status: 'active' });
              emittedCronologista = true;
            }
            if (state.currentPhase === 'DONE') {
              emit({ type: 'step', step: 3, label: 'Plan Finalizado', status: 'done' });
            }
          }

          let replyContent = "";
          if (finalState && finalState.messages && finalState.messages.length > 0) {
            const lastMsg = finalState.messages[finalState.messages.length - 1];
            if (lastMsg instanceof AIMessage) {
              replyContent = lastMsg.content as string;
            }
          }

          if (finalState?.currentPhase === 'DONE') {
            replyContent = replyContent || "¡Excelente equipo! He diseñado el plan colaborativo. Revísenlo en la Mesa de Dibujo.";
          }

          if (replyContent) {
            const aiMessage = await prisma.spaceMessage.create({
              data: { spaceId, role: 'assistant', content: replyContent, mentions: [] },
              include: { user: { select: { name: true, avatarUrl: true, id: true } } }
            });
            emit({
              type: 'complete',
              message: aiMessage, // Also pass the newly created DB message to the client
              reply: replyContent,
              currentPhase: finalState?.currentPhase || 'COACH',
              smartCriteria: finalState?.smartCriteria || initialState.smartCriteria,
              actionPlan: finalState?.actionPlan || null
            });
          }

        } catch (err: any) {
          console.error('[GroupGoalGraph Stream] Error:', err);
          emit({ type: 'error', error: err.message || 'Error executing graph' });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      }
    });

  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: spaceId } = resolvedParams;

    if (!/^[0-9a-fA-F]{24}$/.test(spaceId)) {
      return NextResponse.json({ error: 'Invalid space ID' }, { status: 400 });
    }

    // Delete all messages in the space
    await prisma.spaceMessage.deleteMany({
      where: { spaceId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/spaces/[id]/chat Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

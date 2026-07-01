import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { goalGraph } from '@/services/goal-graph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'Not authenticated' }), { status: 401 });
    }

    const { sessionId, message, smartCriteria, actionPlan, attachedContext } = await req.json();
    if (!message?.trim()) {
      return new Response(JSON.stringify({ success: false, error: 'Missing message' }), { status: 400 });
    }

    const byokKey = req.cookies.get('bean_byok_key')?.value;
    const byokProvider = req.cookies.get('bean_byok_provider')?.value;

    let chatSession = null;
    let recentMessages: any[] = [];
    if (sessionId) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 10 } }
      });
      if (chatSession) {
        recentMessages = chatSession.messages.reverse();
      }
    } else {
      chatSession = await prisma.chatSession.create({
        data: { userId, context: 'smart-planner' }
      });
    }

    const resolvedSessionId = chatSession!.id;

    await prisma.chatMessage.create({
      data: { sessionId: resolvedSessionId, role: 'user', content: message }
    });

    const graphMessages = recentMessages.map(m => 
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    );
    graphMessages.push(new HumanMessage(message));

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
      currentPhase: actionPlan ? 'REVISOR' : 'COACH',
      actionPlan: actionPlan || null,
      attachedContext: attachedContext || null,
      config: configData
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (event: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
        };

        try {
          const { CallbackHandler } = await import("langfuse-langchain");
          const langfuseHandler = new CallbackHandler({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_BASEURL || "https://cloud.langfuse.com",
            sessionId: resolvedSessionId,
            userId: userId,
            tags: ["smart-planner"]
          });

          emit({ type: 'step', step: 1, label: 'Coach analizando requerimientos...', status: 'active' });

          const runner = await goalGraph.stream(initialState, { 
            streamMode: "values", 
            callbacks: [langfuseHandler] 
          });

          let finalState: any = null;
          let emittedEstratega = false;
          let emittedCronologista = false;

          for await (const s of (runner as any)) {
            const state = s as any;
            finalState = state;
            if (state.currentPhase === 'ESTRATEGA' && !emittedEstratega) {
              emit({ type: 'step', step: 1, label: 'Requerimientos validados', status: 'done' });
              emit({ type: 'step', step: 2, label: 'Estratega aplicando ingeniería inversa...', status: 'active' });
              emittedEstratega = true;
            }
            if (state.currentPhase === 'CRONOLOGISTA' && !emittedCronologista) {
              emit({ type: 'step', step: 2, label: 'Hitos generados', status: 'done' });
              emit({ type: 'step', step: 3, label: 'Cronologista calculando riesgos y fechas...', status: 'active' });
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
            replyContent = replyContent || "¡Excelente! He diseñado tu plan. Revísalo en la Mesa de Dibujo.";
          }

          if (replyContent) {
            await prisma.chatMessage.create({
              data: { sessionId: resolvedSessionId, role: 'assistant', content: replyContent }
            });
          }

          emit({
            type: 'complete',
            reply: replyContent,
            sessionId: resolvedSessionId,
            currentPhase: finalState?.currentPhase || 'COACH',
            smartCriteria: finalState?.smartCriteria || initialState.smartCriteria,
            actionPlan: finalState?.actionPlan || null
          });

        } catch (err: any) {
          console.error('[SmartPlanner Stream] Error:', err);
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
    console.error('POST /api/ai/smart-planner Error:', error?.message ?? error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
  }
}

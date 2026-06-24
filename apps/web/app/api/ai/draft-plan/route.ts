import { NextRequest } from 'next/server';
import { GoalService } from '@/services/goal-service';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalData, previousDraft, revisionInstructions, spaceId } = body;
    const byokKey = request.cookies.get('bean_byok_key')?.value;
    const byokProvider = request.cookies.get('bean_byok_provider')?.value;

    const session = await auth();
    let userId = session?.user?.id;
    
    // Fallback for dev if no user found
    if (!userId) {
      const fallbackUser = await prisma.user.findFirst();
      userId = fallbackUser?.id;
    }

    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!goalData || !goalData.goalTitle) {
      return new Response(JSON.stringify({ success: false, error: 'Missing goalData' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (event: any) => {
          try {
            controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
          } catch (e) {
            console.error('[DraftPlan Stream] Controller enqueue error:', e);
          }
        };

        const emitWithDbSave = async (event: any) => {
          if (event.type === 'negotiation_needed') {
            const diagnosis = event.diagnosis;
            const msgContent = `⚠️ **Evaluación de Viabilidad (Meta No Viable Directamente)**:

* **Punto de partida**: ${diagnosis.origin || 'No definido'}
* **Brechas identificadas**:
${(diagnosis.gaps || []).map((g: string) => `  - ${g}`).join('\n')}
* **Riesgos y Advertencias**:
${(diagnosis.warnings || []).map((w: string) => `  - ${w}`).join('\n')}
* **Duración estimada**: ${diagnosis.estimatedMonths || 0} meses.

El plan no es viable actualmente con la disponibilidad de horas o el presupuesto indicado. ¿Cómo deseas proceder? Podemos:
1. Ajustar el presupuesto o tiempo semanal.
2. Extender el plazo.
3. Acotar el alcance.`;

            try {
              if (spaceId && spaceId !== 'personal') {
                await prisma.spaceMessage.create({
                  data: {
                    spaceId,
                    role: 'assistant',
                    content: msgContent,
                    mentions: []
                  }
                });
              } else {
                const activeSession = await prisma.chatSession.findFirst({
                  where: { userId },
                  orderBy: { updatedAt: 'desc' }
                });
                if (activeSession) {
                  await prisma.chatMessage.create({
                    data: {
                      sessionId: activeSession.id,
                      role: 'assistant',
                      content: msgContent
                    }
                  });
                }
              }
            } catch (saveErr) {
              console.error('[DraftPlan Stream] Error saving renegotiation message to DB:', saveErr);
            }
          }
          emit(event);
        };

        try {
          const goalService = new GoalService();
          emit({ type: 'step', step: 0, label: 'Inicializando parámetros y ADN...', status: 'active' });

          const goalInputText = goalData.description
            ? `${goalData.goalTitle}. ${goalData.description}`
            : goalData.goalTitle;
          const parsedGoal = await goalService.parseGoalWithAI(goalInputText, userId, byokKey, byokProvider);

          // If the AI couldn't even parse the goal intent, stop before running
          // the expensive 3-agent pipeline on a misunderstood goal and ask the
          // user to clarify instead.
          if (parsedGoal._parseFailed) {
            await emitWithDbSave({
              type: 'negotiation_needed',
              diagnosis: {
                origin: '',
                gaps: [],
                warnings: ['No pude interpretar bien tu meta. ¿Puedes describirla con un poco más de detalle (qué quieres lograr, en cuánto tiempo, y cuántas horas por semana puedes dedicarle)?'],
                estimatedMonths: 0,
                feasibility: 'unrealistic',
                feasibilityNote: 'No se pudo interpretar la meta.'
              }
            });
            return;
          }

          parsedGoal.constraints = {
            timePerWeek: goalData.hoursPerWeek,
            targetDate: goalData.targetDate,
            budgetTotal: goalData.budget || 0
          } as any;

          // Fetch recent chat context to align the planner with conversational consensus
          let chatContext = '';
          try {
            if (spaceId && spaceId !== 'personal') {
              const lastMessages = await prisma.spaceMessage.findMany({
                where: { spaceId },
                orderBy: { createdAt: 'desc' },
                take: 30
              });
              const reversed = [...lastMessages].reverse();
              chatContext = reversed.map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente (BEAN)'}: ${m.content}`).join('\n');
            } else {
              const activeSession = await prisma.chatSession.findFirst({
                where: { userId },
                orderBy: { updatedAt: 'desc' }
              });
              if (activeSession) {
                const lastMessages = await prisma.chatMessage.findMany({
                  where: { sessionId: activeSession.id },
                  orderBy: { createdAt: 'desc' },
                  take: 30
                });
                const reversed = [...lastMessages].reverse();
                chatContext = reversed.map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');
              }
            }
          } catch (chatHistoryError) {
            console.error('[DraftPlan API] Error fetching chat history context:', chatHistoryError);
          }

          // 1. Audit Resources — if the math doesn't work out, stop here and
          // ask the user to renegotiate instead of burning a full plan generation.
          if (!previousDraft) {
            const audit = await goalService.auditGoalResources(parsedGoal, userId, chatContext, byokKey, byokProvider);
            if (!audit.isViable) {
              console.log(`[DraftPlan] Audit failed, asking for renegotiation. Reason: ${audit.renegotiationMessage}`);
              await emitWithDbSave({
                type: 'negotiation_needed',
                diagnosis: {
                  origin: parsedGoal.dnaAnalysisInsight || '',
                  gaps: [],
                  warnings: [audit.renegotiationMessage].filter(Boolean),
                  estimatedMonths: parsedGoal.estimatedDurationMonths || 0,
                  feasibility: 'unrealistic',
                  feasibilityNote: audit.renegotiationMessage || ''
                }
              });
              return;
            }
          }

          // 2. Draft the Plan
          const userDNA = await goalService.getUserDNA(userId);
          const dnaAnalysis = goalService.computeDNAAnalysis(parsedGoal.relevantDimensions || ['skills'], userDNA);

          // Fetch team context if spaceId is provided and not personal
          let teamContext = '';
          if (spaceId && spaceId !== 'personal') {
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
            if (space) {
              for (const member of space.members) {
                const u = member.user;
                const dna = u.attributes.map(a => `- ${a.dimension.label}: ${a.name}`).join('\n');
                teamContext += `Miembro: ${u.name} (ID: ${u.id})\nRol: ${member.role}\nADN:\n${dna || 'Sin ADN definido'}\n\n`;
              }
            }
          }

          const constraints = {
            ...parsedGoal.constraints,
            teamContext,
            chatContext
          };

          emit({ type: 'step', step: 0, status: 'done' });

          const { draft, diagnosis } = await goalService.generateHierarchicalPlan(
            parsedGoal,
            dnaAnalysis,
            constraints,
            userId,
            previousDraft,
            revisionInstructions,
            byokKey,
            byokProvider,
            async (progressEvent) => {
              await emitWithDbSave(progressEvent);
            }
          );

          emit({ type: 'complete', draft, diagnosis });
        } catch (err: any) {
          console.error('[DraftPlan Stream] Error in stream generation:', err);
          emit({ type: 'error', error: err.message || 'Error generating plan' });
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
    console.error('Error in POST /api/ai/draft-plan:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// =======================================================
// BEAN — API Route: GET + POST /api/ai/chat
// Permanent AI Coach chat with DB persistence
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { openai, getTracedOpenAI } from '@/lib/openai';
import { GoalService } from '@/services/goal-service';

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

    let session = await prisma.chatSession.findFirst({
      where: { userId, context },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

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

export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { sessionId, message, context } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 });
    }

    // 1. Resolve or create session
    let resolvedSessionId = sessionId;
    if (!resolvedSessionId) {
      const ctx = context ?? 'insights';
      const newSession = await prisma.chatSession.create({
        data: { userId, context: ctx }
      });
      resolvedSessionId = newSession.id;
    }
    const [chatSession, user] = await Promise.all([
      prisma.chatSession.findUnique({
        where: { id: resolvedSessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          attributes: { include: { dimension: true } },
          goals: {
            where: { status: 'active' },
            include: { actions: { select: { title: true, isCompleted: true } } }
          }
        }
      })
    ]);

    if (!chatSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // 2. Build rich context from user DNA and goals
    const dnaSummary = user.attributes.length > 0
      ? user.attributes.map(a => `- ${a.dimension.label} (${a.category}): ${a.name}`).join('\n')
      : 'Sin características registradas aún.';

    const goalsSummary = user.goals.length > 0
      ? user.goals.map(g => {
          const total = g.actions.length;
          const done = g.actions.filter(a => a.isCompleted).length;
          return `- "${g.title}" (${done}/${total} actividades completadas)`;
        }).join('\n')
      : 'Sin metas activas en el árbol de vida.';

    // 3. System prompt with workload context
    const goalService = new GoalService();
    const workload = await goalService.getUserWorkloadContext(user.id);
    const workloadContext = `AGENDA Y RUTINAS DEL USUARIO (Incluye sueño, trabajo y transporte):
${workload.commitmentsSummary.join('\n')}

HORAS TOTALES OCUPADAS POR DÍA (próximos 30 días, incluyendo sueño):
${JSON.stringify(workload.dailyHours)}`;

    const systemPrompt = `
Eres el Guía BEAN, el Agente de Vida unificado. Tienes dos fases y debes fluir entre ellas.

FASE 1: EXPLORADOR (Ideación y ADN)
- Analiza el perfil (ADN) del usuario para revelar patrones y oportunidades.
- Eres cálido, creativo e inspirador. Recomienda caminos alineados a su perfil.
- Ayuda al usuario a descubrir qué quiere hacer (ej. conseguir un empleo, crear un hábito, aprender una habilidad).

FASE 2: ARQUITECTO (Dimensionamiento y Realidad)
- Cuando el usuario decide perseguir una meta, te conviertes en un ASESOR/MENTOR estricto pero amable y orgánico.
- REGLA DE ORO (Metas vs Tareas): La META PRINCIPAL es el resultado final que el usuario busca (ej. "Conseguir empleo como AI Engineer"). Las certificaciones, cursos o herramientas específicas que le recomiendes son simplemente HITOS (tareas) de esa meta. NUNCA reemplaces su meta principal por un hito a la hora de estructurar el plan.
- ROL DE ASESOR: NO le pidas simplemente al usuario que adivine el tiempo o el dinero. **Propón tú un plan tentativo**. Dile aproximadamente cuánto tiempo (semanas/meses) suele tomar lograr esa meta, cuánto dinero podría requerir, y qué etapas principales (fases) le recomiendes.
- LLEGAR A UN CONSENSO: Conversa con él sobre esta propuesta. Pregúntale si está de acuerdo con las etapas, el tiempo estimado y si su presupuesto y disponibilidad semanal (frente a su "CARGA DE TRABAJO ACTUAL") se ajustan a esta propuesta.

INTERACCIÓN HUMANA (CRÍTICO):
- NO preguntes datos como un interrogatorio robótico. Hazlo de forma conversacional debatiendo la propuesta.
- Si el usuario ya te dio un dato implícitamente (ej. "3 horas diarias" = 21h/semana), ASÚMELO y ajusta tu propuesta en base a ello.
- Revisa si su agenda (horas de sueño, trabajo) tiene espacio. Si tu propuesta de horas choca con su agenda, recomiéndale bajar las horas y alargar la fecha límite de forma empática para cuidar su salud mental.

LLAMADA A LA ACCIÓN (TOOL CALLING):
- SOLO cuando tú y el usuario hayan llegado a un CONSENSO sobre la propuesta (horas por semana, fecha límite y fases generales acordadas), debes ejecutar la herramienta (tool) \`dimension_goal\`.
- Recuerda: Pasa la "Meta Principal" al tool, no un hito intermedio.

ADN DEL USUARIO:
${dnaSummary}

METAS ACTUALES:
${goalsSummary}

CARGA DE TRABAJO ACTUAL:
${workloadContext}

NOMBRE DEL USUARIO: ${user.name ?? 'Viajero'}

REGLAS DE FORMATO:
- Usa **negritas** para conceptos clave.
- Respuestas cortas, muy humanas y cálidas, sin viñetas excesivas.
    `.trim();

    // 4. Save user message first
    await prisma.chatMessage.create({
      data: { sessionId: resolvedSessionId, role: 'user', content: message }
    });

    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...chatSession.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "dimension_goal",
          description: "Ejecuta esta herramienta SOLO cuando el usuario y tú hayan acordado la meta, las horas a la semana y la fecha límite.",
          parameters: {
            type: "object",
            properties: {
              goalTitle: { type: "string", description: "Título claro de la meta" },
              dimensionName: { type: "string", description: "Dimensión (ej: Profesión, Intelecto, Salud)" },
              hoursPerWeek: { type: "number", description: "Horas semanales a dedicar" },
              targetDate: { type: "string", description: "Fecha límite" },
              budget: { type: "number", description: "Presupuesto (opcional)" }
            },
            required: ["goalTitle", "dimensionName", "hoursPerWeek", "targetDate"]
          }
        }
      }
    ];

    const tracedClient = getTracedOpenAI({
      userId: userId,
      sessionId: resolvedSessionId,
      tags: ["agent:chat-coach", `env:${process.env.NODE_ENV || 'development'}`]
    });

    const response = await tracedClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: aiMessages as any,
      temperature: 0.8,
      tools: tools as any,
      tool_choice: "auto",
    });

    const choice = response.choices[0];
    const toolCall = choice.message?.tool_calls?.[0];
    
    let cleanReply = choice.message?.content || "";
    let branchData = null;

    if (toolCall && (toolCall as any).function?.name === 'dimension_goal') {
      try {
        const args = JSON.parse((toolCall as any).function.arguments);
        branchData = args;
        // Provide a friendly confirmation that generation is starting
        cleanReply = cleanReply || `¡Perfecto! Ya tenemos las dimensiones claras (${args.hoursPerWeek}h/semana para ${args.targetDate}). Dame un momento, estoy diseñando y calculando el plan exacto para tu meta...`;
      } catch (e) {
        console.warn('Failed to parse tool arguments:', e);
      }
    } else if (!cleanReply) {
      cleanReply = "Hubo un error al procesar la respuesta.";
    }

    // 8. Save assistant reply (clean version)
    await prisma.chatMessage.create({
      data: { sessionId: resolvedSessionId, role: 'assistant', content: cleanReply }
    });

    return NextResponse.json({ success: true, reply: cleanReply, branchData, sessionId: resolvedSessionId });
  } catch (error: any) {
    console.error('POST /api/ai/chat Error:', error?.message ?? error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      detail: process.env.NODE_ENV !== 'production' ? (error?.message ?? String(error)) : undefined
    }, { status: 500 });
  }
}

import { prisma } from '@/lib/prisma';
import { getTracedOpenAI } from '@/lib/openai';
import { GoalService } from '@/services/goal-service';

export class ChatCoachService {
  async getOrCreateSession(userId: string, sessionId?: string, context?: string) {
    const ctx = context ?? 'insights';
    if (sessionId) {
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
      if (session) return session;
    }

    // Find existing or create new
    let session = await prisma.chatSession.findFirst({
      where: { userId, context: ctx },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, context: ctx },
        include: { messages: true }
      });
    }

    return session;
  }

  async generateResponse(userId: string, sessionId: string | null, message: string, context?: string) {
    if (!message?.trim()) {
      throw new Error('Missing message');
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
      throw new Error('Session not found');
    }
    if (!user) {
      throw new Error('User not found');
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

    // 3. System prompt selection based on context
    const isWeeklyReview = chatSession?.context === 'weekly_review';
    let systemPrompt = '';

    if (isWeeklyReview) {
      systemPrompt = `
Eres el Guía BEAN, el Coach de Vida Inteligente. Estás en medio de la **Revisión Semanal Proactiva** con el usuario.

Tu objetivo en esta conversación es:
1. **Auditar el progreso** de la semana pasada con un enfoque constructivo y motivador. Celebra los logros y mantén una actitud empática.
2. **Identificar fricciones**: Si el usuario no completó sus ritmos/hábitos o tareas, pregúntale con empatía qué ocurrió (falta de tiempo, energía, imprevistos, desmotivación).
3. **Proponer ajustes realistas**: Si hubo problemas de consistencia, ofrece soluciones concretas y viables:
   - Reducir las horas semanales dedicadas a una meta.
   - Ajustar el horario, frecuencia o días de un hábito o compromiso base.
   - Mover la fecha límite (deadline) de una meta hacia adelante de forma empática.
   - Simplificar tareas complejas dividiéndolas en subtareas de máximo 1.5 horas.
4. **Acordar cambios**: No impongas cambios. Debate con el usuario y obtén su consentimiento.

NOMBRE DEL USUARIO: ${user.name ?? 'Viajero'}

REGLAS DE FORMATO:
- Comunícate en español de manera muy natural, cálida y empática.
- No uses listas de viñetas aburridas ni hables de forma robótica.
- Usa **negritas** para conceptos clave.
- Respuestas cortas, conversacionales y enfocadas en un solo punto para mantener el diálogo fluido.
      `.trim();
    } else {
      const goalService = new GoalService();
      const workload = await goalService.getUserWorkloadContext(user.id);
      const workloadContext = `AGENDA Y RUTINAS DEL USUARIO (Incluye sueño, trabajo y transporte):
${workload.commitmentsSummary.join('\n')}

HORAS TOTALES OCUPADAS POR DÍA (próximos 30 días, incluyendo sueño):
${JSON.stringify(workload.dailyHours)}`;

      systemPrompt = `
Eres el Guía BEAN, el Agente de Vida unificado. Tienes dos fases y debes fluir entre ellas.

FASE 1: EXPLORADOR (Ideación y ADN)
- Analiza el perfil (ADN) del usuario para revelar patrones y oportunidades.
- Eres cálido, creativo e inspirador. Recomienda caminos alineados a su perfil.
- Ayuda al usuario a descubrir qué quiere hacer (ej. conseguir un empleo, crear un hábito, aprender una habilidad).
- **Si el usuario está indeciso o no tiene una meta clara:** Sugiérele tú de inmediato 2 o 3 metas tentativas basadas en su ADN para ayudarle a elegir y evitar que la conversación se estanque.

FASE 2: ARQUITECTO (Dimensionamiento y Realidad)
- Cuando el usuario decide perseguir una meta, te conviertes en un ASESOR/MENTOR estricto pero amable y orgánico.
- **FILTRO DE IDENTIDAD (CRÍTICO / OBLIGATORIO):** DEBES plantear la pregunta sobre el cambio de identidad (*"¿En quién te tienes que convertir en tu día a día para lograr esta meta?"*, ej. *"debo ser alguien que escribe 30 min al día"*) en los primeros 2 o 3 turnos de la conversación. Es obligatorio discutir esto antes de cerrar el trato.
- **FILTRO SMART:** Asegúrate de que la meta consensuada sea Específica, Medible, Alcanzable, Relevante y con un Límite de tiempo. Define el destino con precisión.
- **REGLA DE ORO (Metas vs Tareas):** La META PRINCIPAL es el resultado final que el usuario busca (ej. "Conseguir empleo como AI Engineer"). Las certificaciones, cursos o herramientas específicas que le recomiendes son simplemente HITOS (tareas) de esa meta. NUNCA reemplaces su meta principal por un hito a la hora de estructurar el plan.
- **ROL DE ASESOR:** NO le pidas simplemente al usuario que adivine el tiempo o el dinero. **Propón tú un plan tentativo**. Dile aproximadamente cuánto tiempo (semanas/meses) suele tomar lograr esa meta, cuánto dinero podría requerir, y qué etapas principales (fases) le recomiendas.
- **LLEGAR A UN CONSENSO:** Conversa con él sobre esta propuesta. Pregúntale si está de acuerdo con las etapas, el tiempo estimado y si su presupuesto y disponibilidad semanal (frente a su "CARGA DE TRABAJO ACTUAL") se ajustan a esta propuesta.

INTERACCIÓN HUMANA Y CIERRE EFICIENTE (CRÍTICO):
- **CIERRE ASERTIVO (MÁXIMO 5 TURNOS):** La conversación debe ser ágil y resolutiva. Procura llegar al consenso en 4 o 5 turnos. No alargues la plática con reflexiones teóricas o preguntas abiertas interminables. En cuanto las restricciones de tiempo y la identidad estén discutidas, propón el acuerdo final.
- Si el usuario ya te dio un dato implícitamente (ej. "3 horas semanales"), ASÚMELO de inmediato, adáptate y no lo vuelvas a preguntar.
- Revisa si su agenda (horas de sueño, trabajo) tiene espacio. Si tu propuesta de horas choca con su agenda, recomiéndale bajar las horas y alargar la fecha límite de forma empática para cuidar su salud mental.

LLAMADA A LA ACCIÓN (TOOL CALLING):
- SOLO cuando tú y el usuario hayan llegado a un CONSENSO sobre la propuesta (horas por semana, fecha límite, fases generales e identidad acordadas), debes ejecutar la herramienta (tool) \`dimension_goal\`.
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
    }

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
      ...(isWeeklyReview ? {} : { tools: tools as any, tool_choice: "auto" }),
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

    // 5. Save assistant reply (clean version)
    await prisma.chatMessage.create({
      data: { sessionId: resolvedSessionId, role: 'assistant', content: cleanReply }
    });

    return {
      reply: cleanReply,
      branchData,
      sessionId: resolvedSessionId
    };
  }
}

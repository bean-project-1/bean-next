import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { GoalService } from '@/services/goal-service';
import { deepseek } from '@/lib/openai';
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await req.json();
    const { messages, userEmail } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Missing or invalid messages' }, { status: 400 });
    }

    // Resolve user
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { attributes: { include: { dimension: true } } }
      });
    }
    
    if (!user && userEmail) {
      user = await prisma.user.findUnique({ 
        where: { email: userEmail },
        include: { attributes: { include: { dimension: true } } }
      });
    }

    // Fallback for dev
    if (!user) {
      user = await prisma.user.findFirst({
        include: { attributes: { include: { dimension: true } } }
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dnaSummary = user.attributes
      .map(attr => `- ${attr.dimension.label}: ${attr.name} (${attr.category})`)
      .join('\n');

    const goalService = new GoalService();
    const workload = await goalService.getUserWorkloadContext(user.id);
    const workloadContext = `AGENDA Y RUTINAS DEL USUARIO (Incluye sueño, trabajo y transporte):
${workload.commitmentsSummary.join('\n')}

HORAS TOTALES OCUPADAS POR DÍA (próximos 30 días, incluyendo sueño):
${JSON.stringify(workload.dailyHours)}`;

    const systemPrompt = {
      role: 'system',
      content: `Eres el BEAN Goal Architect, un coach de vida empático pero un GATEKEEPER ESTRICTO de la viabilidad. 
Tu misión es ayudar al usuario a definir un OBJETIVO para su Árbol de Vida, pero NO le permitirás crearlo si no tiene los recursos matemáticos y lógicos para ejecutarlo.

CONTEXTO DEL USUARIO (ADN):
${dnaSummary}

${workloadContext}

REGLAS DE CONVERSACIÓN Y GATEKEEPING (CRÍTICO):
1. REQUISITOS OBLIGATORIOS: Antes de permitir crear la meta, debes confirmar 4 cosas explícitamente en la charla:
   - QUÉ: La definición clara de la meta.
   - TIEMPO SEMANAL: Cuántas horas a la semana está dispuesto a invertir.
   - RECURSOS/FINANZAS: Presupuesto y ahorro mensual (solo si la meta implica costos como viajes, negocios, equipo caro).
   - FECHA OBJETIVO o PRIORIDAD: Para cuándo lo quiere.
2. ANÁLISIS DE CALENDARIO (GATEKEEPING): Revisa el "CARGA DE TRABAJO ACTUAL DEL USUARIO". Si el usuario ya tiene su agenda llena (ej. trabaja 8h/día y tiene otras metas) y promete "invertir 20 horas a la semana" en esta nueva meta, CONFRÓNTALO. Dile que su calendario actual no da abasto y oblígalo a ser realista o a replantear su objetivo.
3. PREGUNTAS SECUENCIALES: Haz 1 sola pregunta a la vez. No lances 4 preguntas juntas. Ve validando los requisitos uno por uno.
4. ADAPTACIÓN AL TIPO DE META: Entiende que una meta en BEAN puede ser un proyecto técnico, una experiencia de vida (viajar), un hábito de salud, o un estado mental. Adapta tu vocabulario, pero siempre exige el recurso "Tiempo".
5. BREVEDAD: Tus respuestas deben ser cortas, conversacionales y potentes (máximo 2 párrafos).
6. BLOQUEO DEL BOTÓN: BAJO NINGUNA CIRCUNSTANCIA digas la frase mágica "¡Plantar Meta! 🚀" a menos que los requisitos aplicables (Tiempo, Dinero, Fecha) estén completamente definidos y validados contra su calendario. Si el usuario pide crear la meta pero falta definir cuántas horas le dedicará, niégate cortésmente y pide el dato.`
    };

    const openAiMessages = [systemPrompt, ...messages];

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: openAiMessages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = response.choices[0]?.message?.content || 'Hubo un error al procesar tu solicitud.';

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('[POST /api/ai/goal-coach] FATAL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

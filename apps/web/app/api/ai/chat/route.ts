// =======================================================
// BEAN — API Route: GET + POST /api/ai/chat
// Permanent AI Coach chat with DB persistence
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
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
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { sessionId, message } = await req.json();
    if (!sessionId || !message?.trim()) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Load the session + history + user DNA
    const [session, user] = await Promise.all([
      prisma.chatSession.findUnique({
        where: { id: sessionId },
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

    if (!session) {
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

    // 3. System prompt
    const systemPrompt = `
Eres BEAN Insights, el Agente de Vida y Coach personal definitivo. Combinás profundidad psicológica, estrategia de vida y planificación práctica. Eres cálido, directo y poderoso.

Tu misión es:
1. Analizar el perfil (ADN) del usuario para revelar patrones, fortalezas y oportunidades ocultas.
2. Proyectar 2-3 "Caminos de Vida" posibles altamente alineados con su perfil (con un % de alineación estimado).
3. Conversar con el usuario para explorar un camino específico y construir un plan de acción.
4. Cuando el usuario y tú estén listos para generar una Meta en el Árbol de Vida, responder con el marcador especial al final de tu mensaje.

ADN DEL USUARIO (Características registradas):
${dnaSummary}

METAS ACTUALES EN EL ÁRBOL DE VIDA:
${goalsSummary}

NOMBRE DEL USUARIO: ${user.name ?? 'Viajero'}

REGLAS DE FORMATO:
- Usa **negritas** para resaltar conceptos clave.
- Usa saltos de línea para respirar el texto.
- Cuando el usuario confirme que quiere crear una Meta/Rama nueva, incluye al FINAL de tu respuesta (después del texto conversacional) el siguiente bloque. NO lo incluyas hasta que el usuario lo confirme explícitamente:

<CREATE_BRANCH>
{
  "goal": "Nombre claro de la Meta",
  "dimensionName": "Nombre de la dimensión (ej: Profesión, Intelecto, Salud Física)",
  "activities": [
    { "title": "Actividad 1", "description": "Descripción detallada de lo que implica." },
    { "title": "Actividad 2", "description": "Descripción detallada de lo que implica." },
    { "title": "Actividad 3", "description": "Descripción detallada de lo que implica." }
  ]
}
</CREATE_BRANCH>
    `.trim();

    // 4. Save user message first
    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content: message }
    });

    // 5. Build full messages array for AI
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...session.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    // 6. Call Deepseek
    const aiRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: aiMessages,
        temperature: 0.8,
        max_tokens: 1500,
      })
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      console.error('Deepseek API error:', err);
      throw new Error(`Deepseek error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const replyText: string = aiData.choices[0]?.message?.content ?? 'Error al procesar respuesta.';

    // 7. Parse CREATE_BRANCH if present
    const branchMatch = replyText.match(/<CREATE_BRANCH>([\s\S]*?)<\/CREATE_BRANCH>/);
    let branchData = null;
    let cleanReply = replyText;

    if (branchMatch) {
      try {
        branchData = JSON.parse(branchMatch[1].trim());
        // Remove the block from the display text
        cleanReply = replyText.replace(/<CREATE_BRANCH>[\s\S]*?<\/CREATE_BRANCH>/, '').trim();
      } catch (e) {
        console.warn('Failed to parse CREATE_BRANCH JSON:', e);
      }
    }

    // 8. Save assistant reply (clean version)
    await prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content: cleanReply }
    });

    return NextResponse.json({ success: true, reply: cleanReply, branchData });
  } catch (error) {
    console.error('POST /api/ai/chat Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

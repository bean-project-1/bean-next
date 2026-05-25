import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
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

    const systemPrompt = {
      role: 'system',
      content: `Eres el BEAN Goal Architect, un coach de vida de élite. 
Tu misión es ayudar al usuario a definir y pulir un OBJETIVO CLARO para su Árbol de Vida.

CONTEXTO DEL USUARIO (ADN):
${dnaSummary}

REGLAS DE CONVERSACIÓN:
1. FOCO TOTAL: Mantente 100% enfocado en la meta que el usuario propone. No te desvíes.
2. USA EL ADN: Conecta la meta con sus valores, habilidades o intereses registrados. Ej: "Dado que valoras la Libertad, ¿cómo te ayuda este proyecto a conseguirla?"
3. BREVEDAD: Tus respuestas deben ser cortas, directas y potentes (máximo 3 párrafos cortos).
4. PREGUNTAS CLAVE: Haz 1 sola pregunta estratégica a la vez que ayude a definir el "Qué", el "Por qué" o el "Cómo".
5. LISTO PARA ACTUAR: Cuando sientas que la meta tiene suficiente detalle (título, descripción clara y urgencia), dile al usuario que haga clic en el botón "¡Plantar Meta! 🚀" que aparece en su pantalla para confirmar y generar el plan. IMPORTANTE: NUNCA digas que ya creaste o plantaste la rama tú mismo. Tú solo ayudas a diseñarla; el usuario debe presionar el botón para materializarla.`
    };

    const openAiMessages = [systemPrompt, ...messages];

    // Llamada Nativa Fetch (Para evitar el bug de Windows con openai formdata-node SDK)
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: openAiMessages,
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DeepSeek API Error]:', errorText);
      return NextResponse.json({ error: `DeepSeek Error: ${response.status} - ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'Hubo un error al procesar tu solicitud.';

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('[POST /api/ai/goal-coach] FATAL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userEmail = 'daniel@bean.app' } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Missing or invalid messages' }, { status: 400 });
    }

    // Fetch the user's "DNA"
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        attributes: { include: { dimension: true } }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dnaSummary = user.attributes
      .map(attr => `- ${attr.dimension.name} (${attr.category}): ${attr.name}`)
      .join('\n');

    const systemPrompt = {
      role: 'system',
      content: `Eres BEAN Coach, un asistente de IA experto en desarrollo personal y profesional. 
El usuario quiere crear un nuevo objetivo en su vida. 
Debes actuar como un "sparring" o coach: haz preguntas breves y directas sobre la viabilidad, 
los recursos, o el tiempo que el usuario tiene para lograr este objetivo. 
No hagas más de 1 o 2 preguntas a la vez para no abrochar al usuario.

Aquí tienes el "ADN" (perfil) del usuario para que personalices tus consejos:
${dnaSummary}

Si sientes que el objetivo ya está claro, dile al usuario que estás listo para generar su plan detallado.`
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

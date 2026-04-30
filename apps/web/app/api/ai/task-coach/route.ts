import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskTitle, taskDescription, messages } = body;

    const systemPrompt = {
      role: 'system',
      content: `Eres BEAN Task Coach, un asistente de Inteligencia Artificial enfocado en ayudar al usuario a completar una tarea concreta.
Tu objetivo es guiar, resolver dudas, o dar instrucciones paso a paso muy concisas y accionables.

TAREA ACTUAL DEL USUARIO:
- Título: ${taskTitle}
- Descripción: ${taskDescription || 'Sin descripción adicional.'}

REGLAS:
- Sé directo, práctico y breve. Evita introducciones largas.
- Si el usuario te pide que le enseñes a hacer la tarea, desglósala en mini-pasos (bullet points).
- Responde siempre en español y mantén un tono motivador y profesional.`
    };

    const openAiMessages = [systemPrompt, ...messages];

    // Llamada a DeepSeek
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
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DeepSeek API Error / Task Coach]:', errorText);
      return NextResponse.json({ error: `DeepSeek Error: ${response.status} - ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'No pude generar una respuesta.';

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('[POST /api/ai/task-coach] FATAL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

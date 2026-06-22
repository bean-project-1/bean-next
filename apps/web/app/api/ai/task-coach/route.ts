import { NextResponse, NextRequest } from 'next/server';
import { getDynamicAIClient, getDynamicModel } from '@/lib/ai-client';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
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

    const tracedClient = getDynamicAIClient(req, {
      userId: userId,
      tags: ["agent:task-coach", `env:${process.env.NODE_ENV || 'development'}`]
    });

    const modelToUse = getDynamicModel(req, 'deepseek-chat');

    const response = await tracedClient.chat.completions.create({
      model: modelToUse,
      messages: openAiMessages as any,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || 'No pude generar una respuesta.';

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('[POST /api/ai/task-coach] FATAL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

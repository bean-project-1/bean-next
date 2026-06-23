import { NextResponse, NextRequest } from 'next/server';
import { getDynamicAIClient, getDynamicModel } from '@/lib/ai-client';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await req.json();
    const { taskTitle, taskDescription, goalTitle, messages } = body;

    const systemPrompt = {
      role: 'system',
      content: `Eres BEAN Task Coach, un asistente de Inteligencia Artificial enfocado en ayudar al usuario a completar una tarea concreta.
Tu objetivo es guiar, resolver dudas, o dar instrucciones paso a paso muy concisas y accionables sobre CÓMO realizar esta tarea en específico.

TAREA ACTUAL DEL USUARIO:
- Título: ${taskTitle}
- Descripción: ${taskDescription || 'Sin descripción adicional.'}
${goalTitle ? `- Meta/Proyecto asociada: ${goalTitle}` : ''}

REGLAS:
1. Sé directo, práctico y breve. Evita introducciones largas.
2. Si el usuario te pide que le enseñes a hacer la tarea, desglósala en mini-pasos (bullet points).
3. Responde siempre en español y mantén un tono motivador y profesional.
4. ROL ESTRICTO DE TUTOR/EJECUCIÓN: Eres un tutor de ejecución. NO tienes la capacidad técnica de modificar la estructura del plan (como agregar tareas, borrar tareas, reprogramar fechas u horas, cambiar responsables de tareas, o marcar metas como completadas).
5. REDIRECCIÓN A PLANIFICACIÓN: Si el usuario te pide hacer cambios a su agenda o estructura de metas (ej. "pásala para mañana", "agrégale una subtarea", "bórrala", "asígnasela a otro"), debes responder de forma amable y directa explicando que no puedes modificar el plan desde aquí, e indícales que deben abrir la "Mesa de Dibujo" o interactuar con el chat principal (Guía de Planificación) de su árbol/espacio para realizar estos cambios.`
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

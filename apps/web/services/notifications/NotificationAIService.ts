import { getTracedOpenAI } from '@/lib/openai';

interface NudgeInput {
  userName: string;
  taskName: string;
  userId: string;
}

export async function generateNudge({ userName, taskName, userId }: NudgeInput) {
  try {
    const tracedOpenai = getTracedOpenAI({
      userId: userId,
      tags: ["agent:notifications", `env:${process.env.NODE_ENV || 'development'}`]
    });

    const response = await tracedOpenai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un coach de productividad persuasivo y empático de la app BEAN. 
Tu objetivo es escribir notificaciones push súper cortas (máximo 60 caracteres el título, 100 caracteres el body) para vencer la inercia del usuario.
Usa la regla de los 2 minutos (sugiere hacer solo una micro-acción diminuta para empezar).
No suenes robótico, usa un tono casual, humano y motivador.
Devuelve SIEMPRE un JSON con este formato: { "title": "...", "body": "..." } sin usar markdown ni comillas extra.`
        },
        {
          role: 'user',
          content: `Usuario: ${userName}\nTarea pendiente: ${taskName}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    const parsed = JSON.parse(content);
    return {
      title: parsed.title || "Hora de avanzar",
      body: parsed.body || `Abre BEAN y dedica solo 2 minutos a ${taskName}.`
    };
  } catch (error) {
    console.error('[NotificationAIService] Error generating nudge:', error);
    // Fallback Nudge
    return {
      title: "Solo 2 minutos ⏳",
      body: `Rompe la inercia. Toca aquí para empezar con: ${taskName}`
    };
  }
}

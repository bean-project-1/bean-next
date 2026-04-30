import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { finalGoalInput, chatHistory, userEmail = 'daniel@bean.app' } = body;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { attributes: { include: { dimension: true } } }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dnaSummary = user.attributes
      .map(attr => `- ${attr.dimension.name}: ${attr.name}`)
      .join('\n');

    const systemPrompt = {
      role: 'system',
      content: `Eres BEAN Coach, experto en estructurar planes de acción.
En base a la conversación previa y el objetivo del usuario, debes generar un plan estructurado en formato estrictamente JSON.
El ADN del usuario es:
${dnaSummary}

FORMATO JSON OBLIGATORIO DE SALIDA (sin Markdown ni backticks, solo el JSON raw):
{
  "goalTitle": "Nombre breve del proyecto/objetivo",
  "dimension": "nombre_de_la_dimension_en_ingles",
  "actions": [
    {
      "title": "Nombre de la accion/habilidad/curso",
      "description": "Explicación detallada de lo que el usuario debe hacer para esta acción.",
      "impact": {"career": 5, "knowledge": 3},
      "tasks": [
        {
          "title": "Nombre de la tarea o paso medible",
          "description": "Descripción detallada de cómo ejecutar este paso específico",
          "startDate": "2026-05-01T00:00:00Z",
          "endDate": "2026-05-05T00:00:00Z",
          "estimatedHours": 10.5
        }
      ]
    }
  ]
}
Nota: El campo dimension debe ser uno de los originales (ej. "career", "knowledge", "skills", "values"). Asume fechas relativas al día de hoy para startDate y endDate en formato ISO8601.`
    };

    const conversation = chatHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    conversation.push({
      role: 'user',
      content: `Genera el plan final en JSON para este objetivo: ${finalGoalInput}`
    });

    // Llamada Nativa Fetch
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [systemPrompt, ...conversation],
        temperature: 0.2, // Low temp for JSON
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DeepSeek API Error / Generate]:', errorText);
      return NextResponse.json({ error: `DeepSeek Error: ${response.status} - ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const rawResponse = data.choices[0]?.message?.content || '{}';
    
    let parsedPlan;
    try {
      const cleanedJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedPlan = JSON.parse(cleanedJson);
    } catch (err) {
      console.error('Failed to parse JSON deeply:', rawResponse);
      return NextResponse.json({ error: 'AI did not return a valid JSON format. Raw output: ' + rawResponse }, { status: 500 });
    }

    const dimension = await prisma.dimension.findUnique({
      where: { name: parsedPlan.dimension || 'career' }
    });

    const newGoal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: parsedPlan.goalTitle || finalGoalInput,
        dimensionId: dimension?.id,
        progress: 0,
        status: 'active'
      }
    });

    if (parsedPlan.actions && Array.isArray(parsedPlan.actions)) {
      for (const action of parsedPlan.actions) {
        await prisma.goalAction.create({
          data: {
            goalId: newGoal.id,
            title: action.title,
            description: action.description,
            isCompleted: false,
            impact: action.impact || {},
            tasks: {
              create: (action.tasks || []).map((task: any) => ({
                title: task.title,
                description: task.description,
                isCompleted: false,
                startDate: task.startDate ? new Date(task.startDate) : null,
                endDate: task.endDate ? new Date(task.endDate) : null,
                estimatedHours: task.estimatedHours || 0,
              }))
            }
          }
        });
      }
    }

    return NextResponse.json({ success: true, goal: newGoal, plan: parsedPlan });

  } catch (error: any) {
    console.error('[POST /api/ai/goal-generate] FATAL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { milestoneTitle, milestoneDescription, evaluationInstructions, evaluationType, submission } = body;

    if (!submission) {
      return NextResponse.json({ error: 'No submission provided' }, { status: 400 });
    }

    const systemPrompt = `Eres un evaluador de logros personales empático y estricto. 
Tu trabajo es analizar la evidencia que presenta un usuario y determinar si ha completado exitosamente su hito/logro.
Responde SIEMPRE con un JSON válido con esta estructura exacta:
{
  "verified": boolean,
  "feedback": "Un mensaje breve, cálido y alentador en español (2-3 oraciones max). Si fue aprobado, celebra el logro. Si no, explica qué falta."
}`;

    let userMessage: any;

    if (evaluationType === 'image' && submission.startsWith('data:image')) {
      // Vision request with image
      userMessage = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Hito: "${milestoneTitle}"
${milestoneDescription ? `Descripción: ${milestoneDescription}` : ''}
${evaluationInstructions ? `Criterio de evaluación: ${evaluationInstructions}` : ''}

El usuario ha subido una imagen como evidencia. ¿Esta imagen demuestra que completó el hito?`,
          },
          {
            type: 'image_url',
            image_url: { url: submission, detail: 'low' },
          },
        ],
      };
    } else {
      // Text or document submission
      userMessage = {
        role: 'user',
        content: `Hito: "${milestoneTitle}"
${milestoneDescription ? `Descripción: ${milestoneDescription}` : ''}
${evaluationInstructions ? `Criterio de evaluación: ${evaluationInstructions}` : ''}

Evidencia del usuario:
---
${submission}
---

¿Esta evidencia demuestra que el usuario completó el hito?`,
      };
    }

    const model = evaluationType === 'image' ? 'gpt-4o-mini' : 'gpt-4o-mini';

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        userMessage,
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0]?.message.content || '{}');

    return NextResponse.json({
      verified: !!result.verified,
      feedback: result.feedback || (result.verified ? '¡Logro confirmado!' : 'No se pudo verificar el logro.'),
    });
  } catch (error: any) {
    console.error('[POST /api/ai/verify-milestone]', error.message);
    return NextResponse.json({
      verified: false,
      feedback: 'Hubo un error al procesar tu evidencia. Por favor intenta de nuevo.',
      error: error.message,
    }, { status: 500 });
  }
}

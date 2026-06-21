import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTracedOpenAI } from '@/lib/openai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { proposal } = await req.json();

    const systemPrompt = `Eres un auditor implacable y analista de inversiones de Venture Capital. 
Tu único trabajo es evaluar la robustez y calidad de un Business Case estructurado en formato JSON y asignar puntajes del 0 al 100 para 3 pilares clave. 
ADEMÁS, debes dar una crítica brutalmente honesta (1-2 oraciones) indicando por qué asignaste ese puntaje y qué le falta a la idea para llegar a 100 en ese pilar.
FINALMENTE, debes generar de 1 a 3 preguntas estratégicas, específicas y directas para cada pilar, que obliguen al usuario a pensar y responder para lograr incrementar su puntaje.

EL DOCUMENTO A EVALUAR ES EL SIGUIENTE:
${proposal ? JSON.stringify(proposal, null, 2) : "Documento vacío."}

REGLAS DE EVALUACIÓN (ESTRICTO PERO GRANULAR):
Usa TODO el espectro de 0 a 100. Suma puntos progresivamente si el usuario agrega información valiosa, aunque no esté perfecto.
1. **Deseable (Sol)** (0-100): 
   - Evalúa 'executiveSummary' y 'problemAnatomy'. 
   - 0: Vacíos.
   - 10-40: Tiene una descripción básica del problema pero sin validación.
   - 40-70: Hay un problema claro y una audiencia definida, pero falta profundidad o métricas.
   - 70-100: Problema doloroso, validación de mercado clara y datos precisos.
2. **Factible (Tierra)** (0-100): 
   - Evalúa 'solutionArchitecture' y 'technicalViability'.
   - 0: Vacíos.
   - 10-40: Ideas vagas de cómo funcionará sin detalles técnicos.
   - 40-70: Arquitectura inicial, se menciona algo del stack técnico pero faltan detalles del MVP.
   - 70-100: MVP perfectamente definido, stack y arquitectura realistas y viables.
3. **Viable (Agua)** (0-100): 
   - Evalúa 'sustainability' y 'riskMatrix'.
   - 0: Vacíos.
   - 10-40: Menciones superficiales sobre cobrar o riesgos obvios.
   - 40-70: Hay una idea de modelo de ingresos y riesgos identificados, pero falta análisis numérico o mitigación profunda.
   - 70-100: Modelo de negocio validado (ingresos/costos claros), Pre-mortem exhaustivo con mitigaciones inteligentes.

IMPORTANTE: El progreso debe notarse. Si el usuario elaboró mejor su idea respecto a estar vacía, otórgale un puntaje acorde a su esfuerzo y detalle (ej. 35, 62, 85). Si una sección no tiene texto o tiene menos de 10 palabras con contenido irrelevante, aporta 0 puntos al pilar.

Tu única salida debe ser el llamado a la función \`set_scores\`.`;

    const tracedClient = getTracedOpenAI({
      userId: userId,
      tags: ["agent:incubator:evaluator"]
    });

    const tools = [
      {
        type: "function",
        function: {
          name: "set_scores",
          description: "Establece los puntajes finales, la crítica y preguntas estratégicas tras evaluar el documento.",
          parameters: {
            type: "object",
            properties: {
              sun: { type: "number", description: "Puntaje Deseable (0-100)" },
              sunFeedback: { type: "string", description: "Crítica directa de por qué se asignó el puntaje Deseable y qué falta." },
              sunQuestions: { type: "array", items: { type: "string" }, description: "1 a 3 preguntas estratégicas para incrementar el puntaje Deseable." },
              earth: { type: "number", description: "Puntaje Factible (0-100)" },
              earthFeedback: { type: "string", description: "Crítica directa de por qué se asignó el puntaje Factible y qué falta." },
              earthQuestions: { type: "array", items: { type: "string" }, description: "1 a 3 preguntas estratégicas para incrementar el puntaje Factible." },
              water: { type: "number", description: "Puntaje Viable (0-100)" },
              waterFeedback: { type: "string", description: "Crítica directa de por qué se asignó el puntaje Viable y qué falta." },
              waterQuestions: { type: "array", items: { type: "string" }, description: "1 a 3 preguntas estratégicas para incrementar el puntaje Viable." }
            },
            required: ["sun", "sunFeedback", "sunQuestions", "earth", "earthFeedback", "earthQuestions", "water", "waterFeedback", "waterQuestions"]
          }
        }
      }
    ];

    const response = await tracedClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.1, // Strict and deterministic
      tools: tools as any,
      tool_choice: { type: "function", function: { name: "set_scores" } },
    });

    const choice = response.choices[0];
    const toolCall = choice.message?.tool_calls?.[0];
    
    if (toolCall && toolCall.type === 'function' && toolCall.function.name === 'set_scores') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        return NextResponse.json({ 
          success: true, 
          scores: { 
            sun: args.sun, 
            sunFeedback: args.sunFeedback,
            sunQuestions: args.sunQuestions,
            earth: args.earth, 
            earthFeedback: args.earthFeedback,
            earthQuestions: args.earthQuestions,
            water: args.water,
            waterFeedback: args.waterFeedback,
            waterQuestions: args.waterQuestions
          } 
        });
      } catch (e) {
        console.error("Error parsing AI tool args", e);
        return NextResponse.json({ success: false, error: 'AI format error' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, error: 'No tool call returned' }, { status: 500 });

  } catch (error) {
    console.error('[EVALUATOR_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

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

    const { title, description, messages, currentScores, currentProposal } = await req.json();

    const systemPrompt = `Eres BEAN AI, el "Inversor y Analista Experto" del Semillero de Ideas.
Tu objetivo es ayudar al usuario a madurar su idea evaluando 3 dimensiones clave (Deseable/Sol, Factible/Tierra, Viable/Agua). A la vez, eres el redactor encargado de construir un Documento de Propuesta estructurado en tiempo real.

IDEA DEL USUARIO:
Título: "${title}"
Descripción inicial: "${description}"

ESTADO ACTUAL DE LA PLANTA (Puntajes de 0 a 100):
- ☀️ Deseable (Sol): ${currentScores.sun}%
- 🌍 Factible (Tierra): ${currentScores.earth}%
- 💧 Viable (Agua): ${currentScores.water}%

DOCUMENTO ACTUAL (Borrador):
${currentProposal || "(Vacío, debes empezar a escribirlo)"}

INSTRUCCIONES CLAVE (CRÍTICO):
1. **SÉ BRUTALMENTE HONESTO Y REALISTA.** No seas un porrista ciego. Si la idea tiene limitaciones físicas, científicas o económicas (ej. pisos piezoeléctricos generan muy poca energía y no son rentables), DEBES DECÍRSELO DIRECTAMENTE.
2. **No seas un simple interrogador.** Si el usuario dice "no sé" o está atascado, propón alternativas reales basadas en lo que existe actualmente en el mercado.
3. Actúa como un consultor experto o un inversor de "Shark Tank". Si la propuesta no da dinero, si la tecnología es carísima, o si nadie pagaría por ello, señálalo. Reta al usuario a pensar en modelos de negocio viables.
4. Tu respuesta debe ser concisa, directa y profesional, pero manteniendo un toque de empatía (no seas grosero, solo realista).
5. Al final, debes usar la función \`update_seed_scores\` para registrar:
   - La nueva puntuación (Baja o sube según los argumentos del usuario).
   - Tu respuesta al usuario.
   - El nuevo "Documento de Propuesta" en formato Markdown. 
     **CRÍTICO: El documento debe seguir ESTRICTAMENTE esta estructura de 9 puntos (Pitch Deck):**
     1. **El Gancho**: Una frase clara y atractiva.
     2. **El Problema**: Dolor real, a quién afecta, por qué falla lo actual.
     3. **La Solución**: Propuesta de valor, qué es, beneficio principal.
     4. **Mercado y Público**: Usuario ideal, tamaño.
     5. **El Producto**: Cómo funciona, MVP.
     6. **Modelo de Sostenibilidad**: Cómo genera dinero/ahorros.
     7. **Tracción**: Validación, feedback, prototipos (lo que se haya hecho en la charla).
     8. **El Equipo**: Por qué ustedes.
     9. **Call to Action**: ¿Qué recursos necesitas ahora mismo?
     Toma el borrador actual y llénalo orgánicamente con lo que vayan hablando. Si un punto no se ha hablado, ponlo como "Por definir...".`;

    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const tracedClient = getTracedOpenAI({
      userId: userId,
      tags: ["agent:incubator"]
    });

    const tools = [
      {
        type: "function",
        function: {
          name: "update_seed_scores",
          description: "Calcula el progreso de la idea y actualiza el documento maestro de propuesta.",
          parameters: {
            type: "object",
            properties: {
              sun: { type: "number", description: "Puntaje Deseable / Problema / Audiencia (0-100)" },
              earth: { type: "number", description: "Puntaje Factible / Técnico / Solución (0-100)" },
              water: { type: "number", description: "Puntaje Viable / Recursos / Negocio (0-100)" },
              proposal: { type: "string", description: "El documento en Markdown actualizado y estructurado con el resumen de la propuesta hasta ahora." },
              reply: { type: "string", description: "Lo que le responderás al usuario en el chat." }
            },
            required: ["sun", "earth", "water", "proposal", "reply"]
          }
        }
      }
    ];

    const response = await tracedClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: aiMessages as any,
      temperature: 0.8,
      tools: tools as any,
      tool_choice: { type: "function", function: { name: "update_seed_scores" } },
    });

    const choice = response.choices[0];
    const toolCall = choice.message?.tool_calls?.[0];
    
    if (toolCall && toolCall.function.name === 'update_seed_scores') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        return NextResponse.json({ 
          success: true, 
          reply: args.reply, 
          proposal: args.proposal,
          newScores: { 
            sun: args.sun, 
            earth: args.earth, 
            water: args.water 
          } 
        });
      } catch (e) {
        console.error("Error parsing AI tool args", e);
        return NextResponse.json({ success: false, error: 'AI format error' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, error: 'No tool call returned' }, { status: 500 });
  } catch (error: any) {
    console.error('POST /api/ai/incubator error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

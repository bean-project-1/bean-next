import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTracedOpenAI } from '@/lib/openai';
import { search } from 'duck-duck-scrape';

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
Tu objetivo es ayudar al usuario a madurar su idea debatiendo y llenando un Documento Estructurado de 6 puntos en tiempo real. No calculas puntajes, solo redactas y conversas.

IDEA DEL USUARIO:
Título: "${title}"
Descripción inicial: "${description}"

DOCUMENTO ACTUAL (En formato JSON):
${currentProposal ? JSON.stringify(currentProposal, null, 2) : "(Vacío, debes empezar a llenarlo)"}

INSTRUCCIONES CLAVE (CRÍTICO):
1. **SÉ BRUTALMENTE HONESTO Y REALISTA.** No seas un porrista ciego. Si la idea tiene limitaciones, DEBES DECÍRSELO.
2. **BUSCA EN LA WEB.** Si el usuario pregunta por estadísticas, estado del arte, competencia o mercado, TIENES la herramienta \`search_web\`. ÚSALA para darle datos reales. NUNCA inventes estadísticas.
3. **APORTA SOLUCIONES.** Si encuentras un problema (con o sin búsqueda), PROPÓN INMEDIATAMENTE alternativas viables.
4. Tu respuesta debe ser concisa, directa y profesional.
5. Al final, debes usar la función \`update_document_and_reply\` para registrar:
   - Tu respuesta al usuario en el chat.
   - Las 6 secciones del Documento de Propuesta. (CRÍTICO AUTO-GUARDADO: Si propones una solución o encuentras un dato clave en la web, REDÁCTALO e incorpóralo INMEDIATAMENTE en la sección pertinente fusionándolo con lo que ya estaba. NO esperes a que el usuario te lo pida. El documento debe evolucionar en CADA respuesta tuya. Para las secciones que no cambien, DEBES copiar el texto exacto que ya tenían).

Las 6 secciones son:
1. executiveSummary: Resumen Ejecutivo y Tesis de Impacto.
2. problemAnatomy: Anatomía del Problema y Validación (Data-Driven).
3. solutionArchitecture: Arquitectura de la Solución y Alcance (El MVP).
4. technicalViability: Viabilidad Técnica y de Datos (El Stack).
5. sustainability: Modelo de Negocio (Ingresos, Estructura de Costos y Viabilidad Financiera).
6. riskMatrix: Matriz de Riesgos y "Antídoto" (Pre-mortem).`;

    const aiMessages: any[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const tracedClient = getTracedOpenAI({
      userId: userId,
      tags: ["agent:incubator:writer"]
    });

    const tools = [
      {
        type: "function",
        function: {
          name: "search_web",
          description: "Busca en internet información actualizada, estadísticas, estado del arte o competidores. Úsalo SIEMPRE que necesites validar un mercado o dar datos duros.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "La consulta de búsqueda a realizar en DuckDuckGo." }
            },
            required: ["query"],
            additionalProperties: false
          },
          strict: true
        }
      },
      {
        type: "function",
        function: {
          name: "update_document_and_reply",
          description: "Responde al usuario y actualiza el documento estructurado de la idea.",
          parameters: {
            type: "object",
            properties: {
              executiveSummary: { type: "string", description: "Resumen Ejecutivo y Tesis de Impacto" },
              problemAnatomy: { type: "string", description: "Anatomía del Problema y Validación" },
              solutionArchitecture: { type: "string", description: "Arquitectura de la Solución y Alcance MVP" },
              technicalViability: { type: "string", description: "Viabilidad Técnica y de Datos" },
              sustainability: { type: "string", description: "Modelo de Negocio (Ingresos, Costos y Viabilidad Financiera)" },
              riskMatrix: { type: "string", description: "Matriz de Riesgos y Pre-mortem" },
              reply: { type: "string", description: "Lo que le responderás al usuario en el chat, incluyendo tus consejos concretos." }
            },
            required: ["executiveSummary", "problemAnatomy", "solutionArchitecture", "technicalViability", "sustainability", "riskMatrix", "reply"],
            additionalProperties: false
          },
          strict: true
        }
      }
    ];

    // First call: allow AI to either search or reply
    const response1 = await tracedClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: aiMessages,
      temperature: 0.8,
      tools: tools as any,
      tool_choice: "auto",
    });

    let choice = response1.choices[0];
    let toolCall = choice.message?.tool_calls?.[0];

    // If AI decides to search
    if (toolCall && toolCall.type === 'function' && toolCall.function.name === 'search_web') {
      try {
        const { query } = JSON.parse(toolCall.function.arguments);
        console.log(`[Incubator] Searching web for: ${query}`);
        
        const searchResults = await search(query);
        // Take top 5 results to keep context small
        const snippets = searchResults.results.slice(0, 5).map(r => `Fuente: ${r.url}\nTítulo: ${r.title}\nResumen: ${r.description}`).join("\n\n");
        
        // Append AI's tool call and the tool response
        aiMessages.push(choice.message);
        aiMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: snippets || "No se encontraron resultados."
        });

        // Second call: Force document update and reply
        const response2 = await tracedClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: aiMessages,
          temperature: 0.8,
          tools: tools as any,
          tool_choice: { type: "function", function: { name: "update_document_and_reply" } },
        });

        choice = response2.choices[0];
        toolCall = choice.message?.tool_calls?.[0];
      } catch (err) {
        console.error("Error executing web search", err);
        // Fallback: force reply without search results if search fails
        const response2 = await tracedClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: aiMessages,
          temperature: 0.8,
          tools: tools as any,
          tool_choice: { type: "function", function: { name: "update_document_and_reply" } },
        });
        choice = response2.choices[0];
        toolCall = choice.message?.tool_calls?.[0];
      }
    } else if (!toolCall || (toolCall.type === 'function' && toolCall.function.name !== 'update_document_and_reply')) {
      // AI replied with text or something else without updating document!
      // We must force it to use update_document_and_reply.
      if (choice.message.content) {
        aiMessages.push(choice.message);
      }
      const response2 = await tracedClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: aiMessages,
        temperature: 0.8,
        tools: tools as any,
        tool_choice: { type: "function", function: { name: "update_document_and_reply" } },
      });
      choice = response2.choices[0];
      toolCall = choice.message?.tool_calls?.[0];
    }
    
    // Process final update_document_and_reply tool call
    if (toolCall && toolCall.type === 'function' && toolCall.function.name === 'update_document_and_reply') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        return NextResponse.json({ 
          success: true, 
          reply: args.reply, 
          proposal: {
            executiveSummary: args.executiveSummary,
            problemAnatomy: args.problemAnatomy,
            solutionArchitecture: args.solutionArchitecture,
            technicalViability: args.technicalViability,
            sustainability: args.sustainability,
            riskMatrix: args.riskMatrix
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

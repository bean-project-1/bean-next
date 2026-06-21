import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function run() {
  const systemPrompt = `Eres BEAN AI...
Tu objetivo es ayudar al usuario a madurar su idea debatiendo y llenando un Documento Estructurado de 6 puntos en tiempo real. No calculas puntajes, solo redactas y conversas.

IDEA DEL USUARIO:
Título: "Zapatos voladores"
Descripción inicial: "Zapatos que vuelan"

DOCUMENTO ACTUAL (En formato JSON):
(Vacío, debes empezar a llenarlo)

INSTRUCCIONES CLAVE (CRÍTICO):
1. **SÉ BRUTALMENTE HONESTO Y REALISTA.** No seas un porrista ciego. Si la idea tiene limitaciones físicas, científicas o económicas, DEBES DECÍRSELO DIRECTAMENTE.
2. **APORTA SOLUCIONES Y CONSEJOS.** El usuario pidió explícitamente: "que me aconseje, no solo me pregunte". Si encuentras un problema, PROPÓN INMEDIATAMENTE al menos 2 soluciones viables, modelos de negocio alternativos o stacks tecnológicos. No te limites a hacer preguntas abiertas; guía al usuario con tu conocimiento experto.
3. Actúa como un consultor experto o un inversor de "Shark Tank". Si la propuesta no da dinero, si la tecnología es carísima, o si nadie pagaría por ello, señálalo y dale la vuelta con una sugerencia concreta.
4. Tu respuesta debe ser concisa, directa y profesional, pero manteniendo un toque de empatía (no seas grosero, solo realista).
5. Al final, debes usar la función \`update_document_and_reply\` para registrar:
   - Tu respuesta al usuario en el chat.
   - Las 6 secciones del Documento de Propuesta (solo actualiza las que tengan sentido según la charla, las demás déjalas igual que en el documento actual o vacías si no hay info).

Las 6 secciones son:
1. executiveSummary: Resumen Ejecutivo y Tesis de Impacto.
2. problemAnatomy: Anatomía del Problema y Validación (Data-Driven).
3. solutionArchitecture: Arquitectura de la Solución y Alcance (El MVP).
4. technicalViability: Viabilidad Técnica y de Datos (El Stack).
5. sustainability: Estrategia de Sostenibilidad y Modelo de Incentivos.
6. riskMatrix: Matriz de Riesgos y "Antídoto" (Pre-mortem).`;

  const aiMessages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'hola' }
  ];

  const tools = [
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
            sustainability: { type: "string", description: "Estrategia de Sostenibilidad y Modelo de Incentivos" },
            riskMatrix: { type: "string", description: "Matriz de Riesgos y Pre-mortem" },
            reply: { type: "string", description: "Lo que le responderás al usuario en el chat, incluyendo tus consejos concretos." }
          },
          required: ["reply"]
        }
      }
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: aiMessages,
      temperature: 0.8,
      tools: tools,
      tool_choice: { type: "function", function: { name: "update_document_and_reply" } },
    });
    console.log(JSON.stringify(response.choices[0], null, 2));
  } catch (e) {
    console.error("OpenAI error:", e);
  }
}
run();

import './load-env';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { Langfuse } from 'langfuse';
import { testPersonas, TestPersona } from './personas';
import { ChatCoachService } from '../../services/chat-coach-service';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com'
});

const MAX_TURNS = 6;

async function setupTestUser(persona: TestPersona) {
  console.log(`[Setup] Creando usuario temporal en DB para: ${persona.name}...`);
  
  // Clean up if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: persona.email }
  });
  if (existingUser) {
    await prisma.user.delete({ where: { email: persona.email } });
  }

  // Create User
  const user = await prisma.user.create({
    data: {
      name: persona.name,
      email: persona.email,
      onboardingCompleted: true
    }
  });

  // Get Dimensions
  const dbDimensions = await prisma.dimension.findMany();
  const dimensionMap: Record<string, string> = {};
  dbDimensions.forEach(d => {
    dimensionMap[d.name] = d.id;
  });

  // Seed Attributes
  const attributesData: any[] = [];
  
  persona.skills.forEach(skill => {
    attributesData.push({
      userId: user.id,
      dimensionId: dimensionMap['skills'] || dbDimensions[0].id,
      name: skill,
      category: 'skill'
    });
  });

  persona.interests.forEach(interest => {
    attributesData.push({
      userId: user.id,
      dimensionId: dimensionMap['interests'] || dbDimensions[0].id,
      name: interest,
      category: 'interest'
    });
  });

  persona.values?.forEach(val => {
    attributesData.push({
      userId: user.id,
      dimensionId: dimensionMap['values'] || dbDimensions[0].id,
      name: val,
      category: 'value'
    });
  });

  if (attributesData.length > 0) {
    await prisma.userAttribute.createMany({ data: attributesData });
  }


  // Seed Base Commitments (Work/Sleep/Study)
  for (const commit of persona.baseCommitments) {
    let resolvedDimIds: string[] = [];
    if (commit.type === 'work' && dimensionMap['career']) resolvedDimIds.push(dimensionMap['career']);
    if (commit.type === 'study' && dimensionMap['knowledge']) resolvedDimIds.push(dimensionMap['knowledge']);
    if (commit.type === 'routine' && dimensionMap['physical_health']) resolvedDimIds.push(dimensionMap['physical_health']);

    await prisma.baseCommitment.create({
      data: {
        userId: user.id,
        title: commit.title,
        type: commit.type,
        daysOfWeek: commit.daysOfWeek,
        hoursPerDay: commit.hoursPerDay,
        isActive: true,
        dimensionIds: resolvedDimIds
      }
    });
  }

  return user;
}

async function cleanUpTestUser(email: string) {
  console.log(`[Cleanup] Eliminando usuario de prueba: ${email}...`);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }
  } catch (error) {
    console.warn(`[Cleanup] Error limpiando usuario:`, error);
  }
}

async function simulateUserTurn(persona: TestPersona, messages: Array<{ role: string; content: string }>) {
  const chatHistoryText = messages
    .map(m => `${m.role === 'user' ? persona.name : 'Guía BEAN'}: ${m.content}`)
    .join('\n');

  const systemPrompt = `
${persona.behaviorInstruction}

REGLAS DE SIMULACIÓN:
1. Responde al último mensaje del "Guía BEAN".
2. Mantén respuestas cortas, realistas y naturales, exactamente como lo haría una persona chateando.
3. Habla en español.
4. NO agregues introducciones como "${persona.name}:" ni corchetes. Simplemente responde el mensaje directo.
  `.trim();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Historial de Chat:\n${chatHistoryText}\n\nTu turno de responder:` }
    ],
    temperature: 0.7
  });

  return response.choices[0]?.message?.content?.trim() || '';
}

async function runEvaluationWithJudge(persona: TestPersona, messages: Array<{ role: string; content: string }>) {
  console.log(`\n[Juez] Evaluando conversación para ${persona.name}...`);
  
  const chatHistoryText = messages
    .map(m => `${m.role === 'user' ? persona.name : 'Guía BEAN'}: ${m.content}`)
    .join('\n');

  const systemPrompt = `
Eres un experto evaluador de IA y Coach de Vida. Tu tarea es juzgar la conversación de coaching de vida entre el usuario ("${persona.name}") y el "Guía BEAN".

DATOS DE CONTEXTO DEL USUARIO:
- Nombre: ${persona.name}
- Restricciones declaradas: ${JSON.stringify(persona.constraints)}
- Descripción: ${persona.description}

Debes calificar las siguientes métricas en un formato estrictamente binario (0 = Falló, 1 = Aprobó) y proveer una crítica detallada de por qué tomaste esa decisión.

MÉTRICAS A EVALUAR:
1. "task_success": ¿La conversación terminó con un consenso exitoso donde el bot propuso/guardó la meta mediante la herramienta? (Busca si se detectó la meta al final).
2. "empathy_passed": ¿El tono fue cálido, empático, motivador y natural, evitando ser robótico o impaciente?
3. "constraints_adhered": ¿El bot respetó y se alineó con las limitaciones de tiempo y presupuesto del usuario? (Ej: si Sofía tiene máx 3h/sem y el bot agendó 10h/sem, falla. Si Mateo tiene $0 y el bot agendó gastos, falla).
4. "smart_criteria_passed": ¿El bot se aseguró de que la meta consensuada sea Específica, Medible, Alcanzable, Relevante y con un plazo temporal claro?
5. "identity_shift_explored": ¿El bot propuso de forma proactiva en quién debe convertirse el usuario (cambio de identidad o mentalidad) para lograr la meta, en lugar de hacerle la pregunta abierta y difícil a él?

Devuelve únicamente un objeto JSON con la siguiente estructura exacta:
{
  "task_success": { "value": 0 o 1, "critique": "Explicación detallada..." },
  "empathy_passed": { "value": 0 o 1, "critique": "Explicación detallada..." },
  "constraints_adhered": { "value": 0 o 1, "critique": "Explicación detallada..." },
  "smart_criteria_passed": { "value": 0 o 1, "critique": "Explicación detallada..." },
  "identity_shift_explored": { "value": 0 o 1, "critique": "Explicación detallada..." }
}
  `.trim();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Transcripción de la conversación:\n${chatHistoryText}` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });

  const content = response.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

async function runPersonaSimulation(persona: TestPersona) {
  console.log(`\n======================================================================`);
  console.log(`SIMULANDO CASO DE PRUEBA: "${persona.name}"`);
  console.log(`Restricciones: ${JSON.stringify(persona.constraints)}`);
  console.log(`======================================================================`);

  let user = null;
  try {
    user = await setupTestUser(persona);
    const chatService = new ChatCoachService();
    const session = await chatService.getOrCreateSession(user.id, undefined, 'global');
    
    let sessionId = session.id;
    let messages: Array<{ role: string; content: string }> = [];
    let currentTurn = 1;
    let branchData = null;

    // Turn 0: User starts the conversation
    let userMsg = "";
    if (persona.id === "gabriela_undecided") {
      userMsg = "Hola, me siento muy estancada profesionalmente pero no sé qué meta ponerme, ¿me puedes ayudar?";
    } else {
      userMsg = `Hola, mi meta es: ${persona.description}. ¿Cómo podemos planificarla?`;
    }

    console.log(`\n[${persona.name}]: ${userMsg}`);
    messages.push({ role: 'user', content: userMsg });

    while (currentTurn <= MAX_TURNS) {
      console.log(`\n--- TURNO ${currentTurn} ---`);
      
      // Call Agent
      const agentResult = await chatService.generateResponse(user.id, sessionId, userMsg, 'global');
      console.log(`[Guía BEAN]: ${agentResult.reply}`);
      messages.push({ role: 'assistant', content: agentResult.reply });

      if (agentResult.branchData) {
        console.log(`[Tool Call] DETECTADA META CONSENSUADA:`, agentResult.branchData);
        branchData = agentResult.branchData;
        break;
      }

      if (currentTurn === MAX_TURNS) {
        break;
      }

      // Simulate User Response
      userMsg = await simulateUserTurn(persona, messages);
      console.log(`[${persona.name}]: ${userMsg}`);
      messages.push({ role: 'user', content: userMsg });
      
      currentTurn++;
    }

    // Run Judge Evaluation
    const evaluation = await runEvaluationWithJudge(persona, messages);
    console.log(`\nRESULTADOS DE EVALUACIÓN PARA ${persona.name.toUpperCase()}:`);
    console.log(JSON.stringify(evaluation, null, 2));

    // Upload Scores to Langfuse
    const isLangfuseConfigured = process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_PUBLIC_KEY !== 'pk-lf-...';
    if (isLangfuseConfigured) {
      console.log(`[Langfuse] Subiendo scores de evaluación para sessionId: ${sessionId}...`);
      for (const [metric, result] of Object.entries(evaluation)) {
        const valObj = result as { value: number; critique: string };
        await langfuse.score({
          sessionId: sessionId,
          name: metric,
          value: valObj.value,
          comment: valObj.critique
        });
      }
      await langfuse.flushAsync();
      console.log(`[Langfuse] Scores subidos con éxito.`);
    } else {
      console.log(`[Langfuse] Omitido: Variables LANGFUSE_PUBLIC_KEY no configuradas en .env`);
    }

    return {
      persona: persona.name,
      success: branchData !== null,
      turns: currentTurn,
      evaluation
    };

  } catch (error) {
    console.error(`Error en simulación de ${persona.name}:`, error);
    return {
      persona: persona.name,
      success: false,
      turns: 0,
      error
    };
  } finally {
    await cleanUpTestUser(persona.email);
  }
}

async function main() {
  console.log("Iniciando Suite de Evaluación E2E para Chatbot Coach...");
  const results = [];
  
  for (const persona of testPersonas) {
    const result = await runPersonaSimulation(persona);
    results.push(result);
  }

  console.log("\n======================================================================");
  console.log("RESUMEN GLOBAL DE LA EVALUACIÓN:");
  console.log("======================================================================");
  results.forEach(r => {
    if ('error' in r) {
      console.log(`- ${r.persona}: ERROR durante la ejecución.`);
    } else {
      const evalObj = r.evaluation as any;
      console.log(`- ${r.persona}:`);
      console.log(`  * Consenso/Éxito: ${r.success ? 'SÍ ✅' : 'NO ❌'} (${r.turns} turnos)`);
      console.log(`  * Empatía Juez: ${evalObj?.empathy_passed?.value === 1 ? 'APROBADO ✅' : 'FALLÓ ❌'}`);
      console.log(`  * Restricciones: ${evalObj?.constraints_adhered?.value === 1 ? 'APROBADO ✅' : 'FALLÓ ❌'}`);
      console.log(`  * SMART Habilitado: ${evalObj?.smart_criteria_passed?.value === 1 ? 'APROBADO ✅' : 'FALLÓ ❌'}`);
      console.log(`  * Foco Identidad: ${evalObj?.identity_shift_explored?.value === 1 ? 'APROBADO ✅' : 'FALLÓ ❌'}`);
    }
  });
  console.log("======================================================================\n");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

// =======================================================
// BEAN AI Engine — Branch Conversation Agent
// services/ai-engine/agents/branchConversationAgent.ts
//
// Conversational agent that dialogues with the user to understand
// their goal, extract a BranchIntent, and present the BranchPlan.
//
// State persists in DB so sessions can be resumed across devices.
// =======================================================
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { BRANCH_CONVERSATION_SYSTEM_PROMPT, BRANCH_CONVERSATION_EXTRACT_INTENT_PROMPT, BRANCH_CONVERSATION_PRESENT_PLAN_PROMPT, } from '../prompts/systemPrompts.js';
// ─── DeepSeek Client ──────────────────────────────────────────────────
function getDeepSeekClient() {
    const apiKey = process.env['DEEPSEEK_API_KEY'];
    if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not set in environment variables.');
    }
    return new OpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com/v1',
    });
}
// ─── Stage Logic ──────────────────────────────────────────────────────
/**
 * Determines if we have enough information to attempt intent extraction.
 * We need: goal description + approximate time horizon + at least one constraint check.
 */
function hasEnoughInfoForIntent(state) {
    const userMessages = state.messages
        .filter((m) => m.role === 'user')
        .map((m) => m.content.toLowerCase())
        .join(' ');
    const hasGoal = userMessages.length > 50;
    const hasTimeReference = /semana|mes|año|week|month|year|\d+ días|\d+ weeks|\d+ months/i.test(userMessages);
    const hasEnoughTurns = state.messages.filter((m) => m.role === 'user').length >= 3;
    return hasGoal && (hasTimeReference || hasEnoughTurns);
}
/**
 * Detects if the user is confirming the current plan.
 */
function isConfirming(message) {
    return /\b(sí|si|yes|confirmo|confirmar|apruebo|adelante|perfecto|listo|ok|okay|va)\b/i.test(message);
}
/**
 * Detects if the user wants to adjust the plan.
 */
function isRequestingAdjustment(message) {
    return /\b(cambiar|ajustar|modificar|change|adjust|modify|menos|más|reduce|increase|diferente)\b/i.test(message);
}
// ─── Core: processMessage ─────────────────────────────────────────────
/**
 * Main entry point for the BranchConversationAgent.
 * Processes one user message and returns the agent reply + updated state.
 *
 * Inject `conversationRepo` and `scheduleRepo` from your API route.
 * They handle DB reads/writes so this agent stays framework-agnostic.
 */
export async function processMessage(userId, userMessage, conversationRepo, scheduleRepo, buildPlanFn) {
    const client = getDeepSeekClient();
    // 1. Load or create conversation state from DB
    let state = await conversationRepo.findByUserId(userId);
    if (!state) {
        state = createInitialState(userId);
    }
    // 2. If already confirmed, return gracefully
    if (state.confirmed) {
        return {
            agentReply: '✅ Tu rama ya está confirmada. ¿Quieres crear una nueva?',
            updatedState: state,
            confirmedPlan: state.currentPlan,
        };
    }
    // 3. Append the user's message to history
    state = appendMessage(state, 'user', userMessage);
    // 4. Route based on current stage
    let agentReply;
    let confirmedPlan;
    switch (state.stage) {
        case 'greeting':
        case 'exploring_goal':
        case 'clarifying_schedule':
        case 'clarifying_constraints': {
            // Advance through dialogue until we have enough info
            if (hasEnoughInfoForIntent(state)) {
                // Try to extract intent and move toward planning
                const { reply, nextStage, extractedIntent } = await handleIntentExtraction(state, client);
                agentReply = reply;
                state.stage = nextStage;
                if (extractedIntent)
                    state.extractedIntent = extractedIntent;
            }
            else {
                // Keep asking questions
                agentReply = await generateConversationalReply(state, client);
                state.stage = advanceStage(state.stage, state.messages.length);
            }
            break;
        }
        case 'confirming_intent': {
            if (isConfirming(userMessage)) {
                // User confirmed intent → build the plan
                const { reply, plan, scheduleWasInferred } = await handlePlanGeneration(state, userId, scheduleRepo, buildPlanFn, client);
                agentReply = reply;
                if (plan) {
                    state.currentPlan = plan;
                    state.scheduleWasInferred = scheduleWasInferred;
                    state.stage = 'reviewing_plan';
                }
                else {
                    // Plan generation failed, stay in confirming stage
                    agentReply = reply;
                }
            }
            else {
                // User wants to clarify something — go back to exploring
                state.stage = 'clarifying_constraints';
                agentReply = await generateConversationalReply(state, client);
            }
            break;
        }
        case 'reviewing_plan': {
            if (isConfirming(userMessage)) {
                state.confirmed = true;
                state.stage = 'confirmed';
                agentReply = buildConfirmationMessage(state.currentPlan);
                confirmedPlan = state.currentPlan;
            }
            else if (isRequestingAdjustment(userMessage)) {
                state.stage = 'adjusting_plan';
                agentReply = await generateAdjustmentReply(state, userMessage, client);
            }
            else {
                // General question about the plan
                agentReply = await generateConversationalReply(state, client);
            }
            break;
        }
        case 'adjusting_plan': {
            // Re-generate plan with new constraints from the adjustment request
            const { reply, plan, scheduleWasInferred } = await handlePlanGeneration(state, userId, scheduleRepo, buildPlanFn, client, userMessage // pass the adjustment note
            );
            agentReply = reply;
            if (plan) {
                state.currentPlan = plan;
                state.scheduleWasInferred = scheduleWasInferred;
                state.stage = 'reviewing_plan';
            }
            break;
        }
        case 'confirmed': {
            agentReply = '✅ Tu rama ya está confirmada. ¡Empecemos! ¿Quieres crear otro objetivo?';
            confirmedPlan = state.currentPlan;
            break;
        }
        default: {
            agentReply = await generateConversationalReply(state, client);
        }
    }
    // 5. Append agent reply to history
    state = appendMessage(state, 'agent', agentReply);
    state.updatedAt = new Date();
    // 6. Persist to DB
    const savedState = await conversationRepo.save(state);
    return {
        agentReply,
        updatedState: savedState,
        confirmedPlan,
    };
}
// ─── Stage Handlers ───────────────────────────────────────────────────
/**
 * Extracts BranchIntent from conversation history via DeepSeek,
 * then generates a confirmation question for the user.
 */
async function handleIntentExtraction(state, client) {
    const history = formatHistoryForPrompt(state.messages);
    try {
        // Step A: Extract structured intent
        const extractCompletion = await client.chat.completions.create({
            model: process.env['DEEPSEEK_MODEL'] ?? 'deepseek-chat',
            messages: [
                {
                    role: 'user',
                    content: BRANCH_CONVERSATION_EXTRACT_INTENT_PROMPT(history),
                },
            ],
            temperature: 0.1,
            max_tokens: 800,
        });
        const intentJson = extractCompletion.choices[0]?.message?.content;
        if (!intentJson)
            throw new Error('Empty intent extraction response');
        const extractedIntent = JSON.parse(intentJson);
        // Step B: Generate a natural confirmation question
        const confirmationCompletion = await client.chat.completions.create({
            model: process.env['DEEPSEEK_MODEL'] ?? 'deepseek-chat',
            messages: [
                { role: 'system', content: BRANCH_CONVERSATION_SYSTEM_PROMPT },
                ...formatMessagesForAPI(state.messages),
                {
                    role: 'user',
                    content: `He extraído la siguiente intención: ${intentJson}\n\n` +
                        `Genera una respuesta natural que:\n` +
                        `1. Resuma brevemente el objetivo tal como lo entendiste\n` +
                        `2. Mencione el horizonte de tiempo\n` +
                        `3. Pregunte si esto es correcto antes de generar el plan`,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });
        const reply = confirmationCompletion.choices[0]?.message?.content ??
            `Entendí que quieres: ${extractedIntent.rawGoal} en ${extractedIntent.timeHorizonWeeks} semanas. ¿Es correcto?`;
        return { reply, nextStage: 'confirming_intent', extractedIntent };
    }
    catch (error) {
        console.error('[BranchConversationAgent] Intent extraction failed:', error);
        return {
            reply: 'Cuéntame un poco más sobre tu objetivo. ¿Qué quieres lograr exactamente y en cuánto tiempo?',
            nextStage: 'exploring_goal',
            extractedIntent: null,
        };
    }
}
/**
 * Calls the BranchPlannerAgent and generates a natural-language presentation of the plan.
 */
async function handlePlanGeneration(state, userId, scheduleRepo, buildPlanFn, client, adjustmentNote) {
    if (!state.extractedIntent) {
        return {
            reply: 'Necesito entender mejor tu objetivo antes de crear el plan. ¿Qué quieres lograr?',
            plan: null,
            scheduleWasInferred: false,
        };
    }
    // Load the user's schedule from DB
    let schedule = await scheduleRepo.findByUserId(userId);
    const scheduleWasInferred = schedule !== null;
    if (!schedule) {
        // No schedule in DB — build a minimal one from what the conversation revealed
        schedule = buildMinimalScheduleFromConversation(state, userId);
    }
    // Apply adjustment to the intent if provided
    const intent = adjustmentNote
        ? { ...state.extractedIntent, constraints: `${state.extractedIntent.constraints ?? ''} ${adjustmentNote}`.trim() }
        : state.extractedIntent;
    try {
        const plan = await buildPlanFn(intent, schedule);
        // Generate natural-language presentation
        const presentationCompletion = await client.chat.completions.create({
            model: process.env['DEEPSEEK_MODEL'] ?? 'deepseek-chat',
            messages: [
                { role: 'system', content: BRANCH_CONVERSATION_SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: BRANCH_CONVERSATION_PRESENT_PLAN_PROMPT(JSON.stringify(plan, null, 2), scheduleWasInferred),
                },
            ],
            temperature: 0.7,
            max_tokens: 600,
        });
        const reply = presentationCompletion.choices[0]?.message?.content ??
            `He diseñado un plan de ${plan.timeHorizonWeeks} semanas con ${plan.habits.length} hábitos. ¿Te parece bien?`;
        return { reply, plan, scheduleWasInferred };
    }
    catch (error) {
        console.error('[BranchConversationAgent] Plan generation failed:', error);
        return {
            reply: 'Hubo un problema al generar el plan. ¿Puedes contarme un poco más sobre tus restricciones de tiempo?',
            plan: null,
            scheduleWasInferred,
        };
    }
}
/**
 * Generates a reply when the user wants to adjust the plan.
 */
async function generateAdjustmentReply(state, adjustmentRequest, client) {
    const completion = await client.chat.completions.create({
        model: process.env['DEEPSEEK_MODEL'] ?? 'deepseek-chat',
        messages: [
            { role: 'system', content: BRANCH_CONVERSATION_SYSTEM_PROMPT },
            ...formatMessagesForAPI(state.messages),
            {
                role: 'user',
                content: `El usuario quiere ajustar el plan con: "${adjustmentRequest}"\n` +
                    `Confirma que entiendes el ajuste y dile que lo estás recalculando.`,
            },
        ],
        temperature: 0.7,
        max_tokens: 200,
    });
    return (completion.choices[0]?.message?.content ??
        'Entendido, voy a ajustar el plan según tu preferencia...');
}
/**
 * Generic conversational reply generation for exploration/clarification stages.
 */
async function generateConversationalReply(state, client) {
    const stageHints = {
        greeting: 'Preséntate brevemente y pregunta qué nuevo objetivo de vida le gustaría explorar.',
        exploring_goal: 'Haz una pregunta para entender mejor el objetivo. Sé específico y empático.',
        clarifying_schedule: 'Pregunta sobre el tiempo disponible del usuario: ¿cuántas horas al día puede dedicar y qué días?',
        clarifying_constraints: 'Pregunta si hay restricciones: presupuesto, condición física, horarios fijos, etc.',
        confirming_intent: 'Resume lo que entendiste y pregunta si es correcto.',
        reviewing_plan: 'Responde la pregunta del usuario sobre el plan de manera natural.',
        adjusting_plan: 'Confirma que entendiste el ajuste y genera la respuesta correspondiente.',
        confirmed: 'El plan está confirmado. Felicita al usuario y ofrece comenzar.',
    };
    const hint = stageHints[state.stage] ?? 'Continúa la conversación de manera natural.';
    const completion = await client.chat.completions.create({
        model: process.env['DEEPSEEK_MODEL'] ?? 'deepseek-chat',
        messages: [
            {
                role: 'system',
                content: `${BRANCH_CONVERSATION_SYSTEM_PROMPT}\n\nContexto actual: ${hint}`,
            },
            ...formatMessagesForAPI(state.messages),
        ],
        temperature: 0.8,
        max_tokens: 300,
    });
    return (completion.choices[0]?.message?.content ??
        '¿Puedes contarme más sobre lo que quieres lograr?');
}
// ─── Helper Functions ─────────────────────────────────────────────────
function createInitialState(userId) {
    return {
        id: randomUUID(),
        userId,
        stage: 'greeting',
        messages: [],
        scheduleWasInferred: false,
        confirmed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
function appendMessage(state, role, content) {
    return {
        ...state,
        messages: [...state.messages, { role, content, timestamp: new Date() }],
    };
}
function formatHistoryForPrompt(messages) {
    return messages
        .map((m) => `${m.role === 'agent' ? 'BEAN' : 'Usuario'}: ${m.content}`)
        .join('\n');
}
function formatMessagesForAPI(messages) {
    return messages.map((m) => ({
        role: m.role === 'agent' ? 'assistant' : 'user',
        content: m.content,
    }));
}
function advanceStage(current, messageCount) {
    const stageOrder = [
        'greeting',
        'exploring_goal',
        'clarifying_constraints',
        'confirming_intent',
    ];
    const idx = stageOrder.indexOf(current);
    if (idx >= 0 && idx < stageOrder.length - 1 && messageCount > (idx + 1) * 2) {
        return stageOrder[idx + 1];
    }
    return current;
}
function buildConfirmationMessage(plan) {
    const habitList = plan.habits
        .map((h) => `• ${h.name} (${h.dailyMinutes} min, ${h.scheduledDays.join(', ')})`)
        .join('\n');
    return (`🌱 ¡Perfecto! Tu nueva rama "${plan.title}" está confirmada.\n\n` +
        `Empezarás con estos hábitos:\n${habitList}\n\n` +
        `${plan.warnings.length > 0 ? `⚠️ Recuerda: ${plan.warnings[0]}\n\n` : ''}` +
        `¡Tu árbol está a punto de crecer! 🌳`);
}
/**
 * Builds a minimal GlobalSchedule from information gathered during conversation.
 * Used as fallback when no schedule data exists in DB.
 */
function buildMinimalScheduleFromConversation(state, userId) {
    // Try to extract any time constraints mentioned during the conversation
    const allUserText = state.messages
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .join(' ');
    // Simple heuristic: look for mentions of work/study hours
    const hasWork = /trabajo|work|oficina|office/i.test(allUserText);
    const hasStudy = /estudio|universidad|universidad|school|college/i.test(allUserText);
    return {
        userId,
        baseCommitments: [
            {
                id: 'inferred-sleep',
                userId,
                name: 'Dormir',
                minutesPerDay: 480, // 8 hours
                scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                isReplaceable: false,
            },
            ...(hasWork
                ? [
                    {
                        id: 'inferred-work',
                        userId,
                        name: 'Trabajo (inferido)',
                        minutesPerDay: 480, // 8 hours
                        scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                        isReplaceable: false,
                    },
                ]
                : []),
            ...(hasStudy
                ? [
                    {
                        id: 'inferred-study',
                        userId,
                        name: 'Estudio (inferido)',
                        minutesPerDay: 240, // 4 hours
                        scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                        isReplaceable: false,
                    },
                ]
                : []),
        ],
        dayTasks: [],
        committedHabits: [],
        wakingMinutesPerDay: 1440,
    };
}
// ─── Exported Agent Object ────────────────────────────────────────────
export const BranchConversationAgent = {
    processMessage,
};

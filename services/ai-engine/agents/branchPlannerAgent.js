// =======================================================
// BEAN AI Engine — Branch Planner Agent
// services/ai-engine/agents/branchPlannerAgent.ts
//
// Receives a BranchIntent + GlobalSchedule and returns a
// time-validated BranchPlan using DeepSeek (OpenAI-compatible).
// =======================================================
import OpenAI from 'openai';
import { BRANCH_PLANNER_SYSTEM_PROMPT, BRANCH_PLANNER_BUILD_PLAN_PROMPT, } from '../prompts/systemPrompts.js';
import { buildAvailabilityMap, fitHabitsInSchedule, buildScheduleSummary, } from './scheduleUtils.js';
// ─── DeepSeek Client ──────────────────────────────────────────────────
/**
 * Returns an OpenAI-compatible client configured to use DeepSeek.
 * DeepSeek's API is fully compatible with the OpenAI SDK — just swap baseURL.
 */
function getDeepSeekClient() {
    const apiKey = process.env['DEEPSEEK_API_KEY'];
    if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not set. Add it to your .env file: DEEPSEEK_API_KEY=sk-...');
    }
    return new OpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com/v1',
    });
}
// ─── Main: buildPlan ──────────────────────────────────────────────────
/**
 * Core function of the BranchPlannerAgent.
 *
 * Flow:
 * 1. Compute deterministic availability from the GlobalSchedule
 * 2. Call DeepSeek to design habits + milestones based on the BranchIntent
 * 3. Validate and fit the AI-suggested habits into the real schedule
 * 4. Return a BranchPlan with isSustainable and warnings
 */
export async function buildPlan(intent, schedule) {
    const client = getDeepSeekClient();
    const wakingMinutes = schedule.wakingMinutesPerDay ?? 960;
    // Step 1: Determine if any BaseCommitment is being replaced
    const replacedCommitment = intent.replacesCommitment
        ? schedule.baseCommitments.find((bc) => bc.isReplaceable &&
            bc.name.toLowerCase().includes(intent.replacesCommitment.toLowerCase()))
        : undefined;
    // Step 2: Build the prompt with real schedule data and call DeepSeek
    const plannerPrompt = BRANCH_PLANNER_BUILD_PLAN_PROMPT(JSON.stringify(intent, null, 2), JSON.stringify(schedule, null, 2), wakingMinutes);
    let rawPlan;
    try {
        const completion = await client.chat.completions.create({
            model: process.env['DEEPSEEK_MODEL'] ?? 'deepseek-chat',
            messages: [
                { role: 'system', content: BRANCH_PLANNER_SYSTEM_PROMPT },
                { role: 'user', content: plannerPrompt },
            ],
            temperature: 0.3, // Low temperature for deterministic planning
            max_tokens: 2000,
        });
        const content = completion.choices[0]?.message?.content;
        if (!content)
            throw new Error('Empty response from DeepSeek planner');
        rawPlan = JSON.parse(content);
    }
    catch (error) {
        console.error('[BranchPlannerAgent] DeepSeek call failed:', error);
        throw new Error(`BranchPlannerAgent failed to generate a plan: ${error.message}`);
    }
    // Step 3: Override the AI's schedule with our deterministic calculation
    // The AI proposes the WHAT and WHY; we calculate the WHEN using real data.
    const availability = buildAvailabilityMap(schedule, replacedCommitment?.id);
    const { fitted: fittedHabits, warnings: fitWarnings } = fitHabitsInSchedule(rawPlan.habits, availability);
    const scheduleSummary = buildScheduleSummary(schedule, fittedHabits, replacedCommitment?.id);
    // Step 4: Merge AI warnings with our deterministic warnings
    const allWarnings = [...(rawPlan.warnings ?? []), ...fitWarnings];
    // isSustainable is authoritative from our deterministic check, not from the AI
    const isSustainable = !Object.values(scheduleSummary.byDay).some((day) => day.isOverloaded);
    if (!isSustainable && !allWarnings.some((w) => w.includes('sobrecarg'))) {
        allWarnings.push('⚠️ El plan supera el tiempo disponible en algún día de la semana. ' +
            'Considera reducir la frecuencia de algunos hábitos o liberar tiempo de otras actividades.');
    }
    return {
        title: rawPlan.title,
        description: rawPlan.description,
        targetDimensions: rawPlan.targetDimensions,
        timeHorizonWeeks: rawPlan.timeHorizonWeeks,
        milestones: rawPlan.milestones ?? [],
        habits: fittedHabits,
        scheduleSummary,
        isSustainable,
        warnings: allWarnings,
    };
}
// ─── Exported Agent Object ────────────────────────────────────────────
export const BranchPlannerAgent = {
    buildPlan,
};

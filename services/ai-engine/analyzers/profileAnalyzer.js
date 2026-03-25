// =======================================================
// BEAN AI Engine — Core Analyzer
// services/ai-engine/analyzers/profileAnalyzer.ts
//
// This module provides placeholder functions for AI analysis.
// Replace with actual OpenAI / FastAPI calls in production.
// =======================================================
import OpenAI from 'openai';
// Initialize OpenAI client (lazy — only if API key present)
const getOpenAIClient = () => {
    if (!process.env['OPENAI_API_KEY']) {
        throw new Error('OPENAI_API_KEY is not set');
    }
    return new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
};
// ---- System prompt builder ----
function buildSystemPrompt() {
    return `You are BEAN, a life intelligence coach and analyst. 
Your role is to analyze a person's life across three pillars: Identity, Capital, and Wellbeing.
Provide honest, empathetic, and actionable insights.
Always respond in valid JSON format.`;
}
function buildProfilePrompt(profile) {
    return `Analyze this life profile and return a JSON object with:
- dimensionScores: array of { name, label, score (0-10), trend }
- lifeScore: number (0-100)
- insights: array of { type, title, body, dimensionName, priority, suggestedAction }

Profile Data:
${JSON.stringify(profile.dimensionScores ?? [])}`;
}
// ---- analyzeProfile ----
/**
 * Sends the user profile to OpenAI and returns dimension scores + life score.
 * Currently returns mock data as placeholder.
 */
export async function analyzeProfile(request) {
    // TODO: Replace mock with actual OpenAI call
    // const openai = getOpenAIClient();
    // const response = await openai.chat.completions.create({ ... });
    console.warn('analyzeProfile: running with mock data — set OPENAI_API_KEY to enable AI');
    const mockScores = [
        { name: 'values', label: 'Values Clarity', category: 'identity', score: 7.5, trend: 'stable' },
        { name: 'interests', label: 'Interests', category: 'identity', score: 8.0, trend: 'up' },
        { name: 'motivations', label: 'Motivations', category: 'identity', score: 6.5, trend: 'stable' },
        { name: 'knowledge', label: 'Knowledge', category: 'capital', score: 7.0, trend: 'up' },
        { name: 'skills', label: 'Skills', category: 'capital', score: 7.5, trend: 'up' },
        { name: 'career', label: 'Career', category: 'capital', score: 6.0, trend: 'stable' },
        { name: 'income', label: 'Income', category: 'capital', score: 5.5, trend: 'stable' },
        { name: 'health', label: 'Health', category: 'capital', score: 7.0, trend: 'up' },
        { name: 'relationships', label: 'Relationships', category: 'experience', score: 7.5, trend: 'stable' },
        { name: 'happiness', label: 'Happiness', category: 'experience', score: 6.5, trend: 'up' },
    ];
    const lifeScore = Math.round((mockScores.reduce((sum, s) => sum + s.score, 0) / (mockScores.length * 10)) * 100);
    return {
        lifeScore,
        dimensionScores: mockScores,
        pillars: [], // Mocking empty pillars for now
        insights: await generateInsights(request),
        trajectory: await simulateTrajectory({ userId: request.userId, dimensionScores: mockScores }),
        generatedAt: new Date(),
    };
}
// ---- generateInsights ----
/**
 * Generates personalized insights using OpenAI.
 * Currently returns placeholder insights.
 */
export async function generateInsights(request) {
    // TODO: Uncomment and implement with real OpenAI call
    // const openai = getOpenAIClient();
    // const completion = await openai.chat.completions.create({
    //   model: process.env.OPENAI_MODEL ?? 'gpt-4-turbo-preview',
    //   messages: [
    //     { role: 'system', content: buildSystemPrompt() },
    //     { role: 'user', content: buildProfilePrompt(request.profile) },
    //   ],
    //   response_format: { type: 'json_object' },
    // });
    console.warn('generateInsights: running with mock data');
    const now = new Date();
    return [
        {
            type: 'strength',
            title: 'Strong intellectual foundation',
            body: 'Your knowledge and skills are above average. Leverage them to accelerate your career.',
            dimensionName: 'skills',
            priority: 2,
            suggestedAction: 'Identify 2–3 high-leverage projects that use your top skills.',
        },
        {
            type: 'gap',
            title: 'Income potential not fully realized',
            body: 'Your income score lags behind your skills score. Consider negotiating or exploring higher-paying opportunities.',
            dimensionName: 'income',
            priority: 1,
            suggestedAction: 'Research market rates for your role and prepare a compensation conversation.',
        },
        {
            type: 'opportunity',
            title: 'Wellbeing is a growth catalyst',
            body: 'Investing in health and relationships has a compounding effect on all other dimensions.',
            dimensionName: 'health',
            priority: 2,
            suggestedAction: 'Schedule consistent exercise and one meaningful social interaction per week.',
        },
    ];
}
// ---- simulateTrajectory ----
/**
 * Simulates life trajectory for the next 12 months using AI.
 * Currently returns linearly interpolated mock projection.
 */
export async function simulateTrajectory(options) {
    const { userId, dimensionScores, months = 12 } = options;
    // TODO: Replace with actual AI trajectory simulation via OpenAI
    console.warn('simulateTrajectory: running with mock projection');
    const now = new Date();
    // Historical: generate 6 past monthly data points (mock)
    const historicalPoints = Array.from({ length: 6 }, (_, i) => {
        const t = new Date(now);
        t.setMonth(t.getMonth() - (6 - i));
        const jitter = (Math.random() - 0.5) * 1.5;
        return {
            timestamp: t,
            lifeScore: Math.min(100, Math.max(0, 65 + i * 1.5 + jitter)),
            dimensionScores: dimensionScores.map((d) => ({
                ...d,
                score: Math.min(10, Math.max(0, d.score - (6 - i) * 0.2 + (Math.random() - 0.5) * 0.5)),
            })),
        };
    });
    // Projected: assume gradual improvement
    const projectedPoints = Array.from({ length: months }, (_, i) => {
        const t = new Date(now);
        t.setMonth(t.getMonth() + i + 1);
        const currentScore = historicalPoints[historicalPoints.length - 1]?.lifeScore ?? 65;
        return {
            timestamp: t,
            lifeScore: Math.min(100, currentScore + i * 0.8 + (Math.random() - 0.3) * 1.2),
            dimensionScores: dimensionScores.map((d) => ({
                ...d,
                score: Math.min(10, d.score + i * 0.08),
            })),
        };
    });
    return {
        userId,
        points: historicalPoints,
        projectedPoints,
        generatedAt: now,
    };
}

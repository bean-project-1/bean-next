// =======================================================
// BEAN AI Engine — Core Analyzer
// services/ai-engine/analyzers/profileAnalyzer.ts
//
// This module provides placeholder functions for AI analysis.
// Replace with actual OpenAI / FastAPI calls in production.
// =======================================================

import OpenAI from 'openai';
import type {
  BeanProfile,
  AnalysisRequest,
  AnalysisResponse,
  DimensionScore,
  Insight,
  LifeTrajectory,
  TrajectoryPoint,
} from '@bean/types';

// Initialize OpenAI client (lazy — only if API key present)
const getOpenAIClient = (): OpenAI => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

// ---- System prompt builder ----

function buildSystemPrompt(): string {
  return `You are BEAN, a life intelligence coach and analyst. 
Your role is to analyze a person's life across three pillars: Identity, Capital, and Wellbeing.
Provide honest, empathetic, and actionable insights.
Always respond in valid JSON format.`;
}

function buildProfilePrompt(profile: BeanProfile): string {
  return `Analyze this life profile and return a JSON object with:
- dimensionScores: array of { key, label, value (0-10), trend }
- lifeScore: number (0-100)
- insights: array of { category, title, body, affectedDimensions, priority, suggestedAction }

Profile:
Identity: ${JSON.stringify(profile.identity)}
Capital: ${JSON.stringify(profile.capital)}
Wellbeing: ${JSON.stringify(profile.wellbeing)}`;
}

// ---- analyzeProfile ----

/**
 * Sends the user profile to OpenAI and returns dimension scores + life score.
 * Currently returns mock data as placeholder.
 */
export async function analyzeProfile(request: AnalysisRequest): Promise<AnalysisResponse> {
  // TODO: Replace mock with actual OpenAI call
  // const openai = getOpenAIClient();
  // const response = await openai.chat.completions.create({ ... });

  console.warn('analyzeProfile: running with mock data — set OPENAI_API_KEY to enable AI');

  const mockScores: DimensionScore[] = [
    { key: 'values', label: 'Values Clarity', value: 7.5, trend: 'stable' },
    { key: 'interests', label: 'Interests', value: 8.0, trend: 'up' },
    { key: 'motivations', label: 'Motivations', value: 6.5, trend: 'stable' },
    { key: 'knowledge', label: 'Knowledge', value: 7.0, trend: 'up' },
    { key: 'skills', label: 'Skills', value: 7.5, trend: 'up' },
    { key: 'career', label: 'Career', value: 6.0, trend: 'stable' },
    { key: 'income', label: 'Income', value: 5.5, trend: 'stable' },
    { key: 'health', label: 'Health', value: 7.0, trend: 'up' },
    { key: 'relationships', label: 'Relationships', value: 7.5, trend: 'stable' },
    { key: 'happiness', label: 'Happiness', value: 6.5, trend: 'up' },
  ];

  const lifeScore = Math.round(
    (mockScores.reduce((sum, s) => sum + s.value, 0) / (mockScores.length * 10)) * 100
  );

  return {
    lifeScore,
    dimensionScores: mockScores,
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
export async function generateInsights(request: AnalysisRequest): Promise<Insight[]> {
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
      id: `insight_${Date.now()}_1`,
      userId: request.userId,
      category: 'strength',
      title: 'Strong intellectual foundation',
      body: 'Your knowledge and skills are above average. Leverage them to accelerate your career.',
      affectedDimensions: ['knowledge', 'skills'],
      priority: 'medium',
      actionable: true,
      suggestedAction: 'Identify 2–3 high-leverage projects that use your top skills.',
      generatedAt: now,
    },
    {
      id: `insight_${Date.now()}_2`,
      userId: request.userId,
      category: 'gap',
      title: 'Income potential not fully realized',
      body: 'Your income score lags behind your skills score. Consider negotiating or exploring higher-paying opportunities.',
      affectedDimensions: ['income', 'career'],
      priority: 'high',
      actionable: true,
      suggestedAction: 'Research market rates for your role and prepare a compensation conversation.',
      generatedAt: now,
    },
    {
      id: `insight_${Date.now()}_3`,
      userId: request.userId,
      category: 'opportunity',
      title: 'Wellbeing is a growth catalyst',
      body: 'Investing in health and relationships has a compounding effect on all other dimensions.',
      affectedDimensions: ['health', 'relationships', 'happiness'],
      priority: 'medium',
      actionable: true,
      suggestedAction: 'Schedule consistent exercise and one meaningful social interaction per week.',
      generatedAt: now,
    },
  ];
}

// ---- simulateTrajectory ----

/**
 * Simulates life trajectory for the next 12 months using AI.
 * Currently returns linearly interpolated mock projection.
 */
export async function simulateTrajectory(options: {
  userId: string;
  dimensionScores: DimensionScore[];
  months?: number;
}): Promise<LifeTrajectory> {
  const { userId, dimensionScores, months = 12 } = options;

  // TODO: Replace with actual AI trajectory simulation via OpenAI

  console.warn('simulateTrajectory: running with mock projection');

  const now = new Date();

  // Historical: generate 6 past monthly data points (mock)
  const historicalPoints: TrajectoryPoint[] = Array.from({ length: 6 }, (_, i) => {
    const t = new Date(now);
    t.setMonth(t.getMonth() - (6 - i));
    const jitter = (Math.random() - 0.5) * 1.5;
    return {
      timestamp: t,
      lifeScore: Math.min(100, Math.max(0, 65 + i * 1.5 + jitter)),
      dimensionScores: dimensionScores.map((d) => ({
        ...d,
        value: Math.min(10, Math.max(0, d.value - (6 - i) * 0.2 + (Math.random() - 0.5) * 0.5)),
      })),
    };
  });

  // Projected: assume gradual improvement
  const projectedPoints: TrajectoryPoint[] = Array.from({ length: months }, (_, i) => {
    const t = new Date(now);
    t.setMonth(t.getMonth() + i + 1);
    const currentScore = historicalPoints[historicalPoints.length - 1]?.lifeScore ?? 65;
    return {
      timestamp: t,
      lifeScore: Math.min(100, currentScore + i * 0.8 + (Math.random() - 0.3) * 1.2),
      dimensionScores: dimensionScores.map((d) => ({
        ...d,
        value: Math.min(10, d.value + i * 0.08),
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

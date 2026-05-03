import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

// Removed static GOAL_TYPE_WEIGHTS in favor of dynamic analysis

const DEFAULT_WEIGHTS = {
  personal_growth: 0.5,
  skills: 0.5
};

export class GoalService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || (process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com/v1' : undefined)
    });
  }

  async parseGoalWithAI(text: string) {
    const prompt = `
      Analyze the following user goal intention: "${text}"
      
      Return a JSON object with:
      1. "title": A concise, inspiring title for the goal.
      2. "description": A short explanation of the goal.
      3. "relevantDimensions": An array of strings representing which areas of life this goal affects (e.g., "career", "health", "knowledge", "skills", "social_capital"). Choose 2-4.
      4. "entities": Any specific companies, roles, or locations mentioned.
    `;

    const model = process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "deepseek-chat";

    try {
      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [{ role: "system", content: "You are a Goal Architecture AI. Return JSON only." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message.content;
      return JSON.parse(content || '{}');
    } catch (error) {
      console.error('Error parsing goal with AI:', error);
      // Fallback
      return {
        title: text,
        description: `Plan para: ${text}`,
        relevantDimensions: ["skills", "knowledge"]
      };
    }
  }

  async getUserDNA(userId: string) {
    const latestState = await prisma.lifeState.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });

    if (!latestState || !latestState.scores || !Array.isArray(latestState.scores)) {
      return {};
    }

    const dimensions = await prisma.dimension.findMany();
    const dimMap: Record<string, string> = {};
    dimensions.forEach(d => { dimMap[d.id] = d.name; });

    const dnaMap: Record<string, number> = {};
    (latestState.scores as any[]).forEach(s => {
      const name = dimMap[s.dimensionId];
      if (name) {
        dnaMap[name] = s.score;
      }
    });

    return dnaMap;
  }

  computeDNAAnalysis(relevantDimensions: string[], userDNA: Record<string, number>) {
    // If no dimensions provided, use defaults
    const dimensions = (relevantDimensions && relevantDimensions.length > 0) 
      ? relevantDimensions 
      : Object.keys(DEFAULT_WEIGHTS);
    
    const targetDimensions: Record<string, number> = {};
    const gap: Record<string, number> = {};
    let totalWeightedScore = 0;
    
    // Equal weights for all identified relevant dimensions
    const weight = 1 / dimensions.length;

    // Target is usually 80+ for a goal
    const TARGET_LEVEL = 85;

    for (const dim of dimensions) {
      const userScore = userDNA[dim] || 30; // Default low if not measured
      targetDimensions[dim] = TARGET_LEVEL;
      gap[dim] = Math.max(0, TARGET_LEVEL - userScore);
      totalWeightedScore += (userScore * weight);
    }

    const readinessScore = Math.min(100, Math.round(totalWeightedScore));

    return {
      targetDimensions,
      gap,
      readinessScore
    };
  }

  async generateHierarchicalPlan(parsedGoal: any, dnaAnalysis: any) {
    const { title, description } = parsedGoal;
    const { gap } = dnaAnalysis;
    const now = new Date();

    console.log(`[GoalService] Generating hierarchical plan for: "${title}"`);

    const prompt = `
      As a Practical Execution Expert, create a highly detailed and structured action plan for the following REAL-WORLD goal.
      
      CRITICAL FOCUS: 
      - Your entire plan must be 100% RELEVANT to the action of achieving the goal.
      - STRICT PROHIBITION: Do NOT create tasks about "analyzing the conversation", "summarizing previous talks", "reviewing chat history", or any meta-planning. 
      - If the goal is "Ser Panadero", the tasks MUST be about flour, ovens, recipes, and business strategy.
      - Do NOT hallucinate unrelated tasks or administrative meta-tasks.
      
      GOAL CONTEXT:
      - Title: "${title}"
      - Main Description: ${description}
      - DNA Gaps to prioritize (Integrate these into the real-world tasks): ${JSON.stringify(gap)}
      - Today's Date: ${now.toISOString()}
      
      STRICT JSON SCHEMA REQUIREMENT:
      Return ONLY a JSON object with this exact structure:
      {
        "phases": [
          {
            "title": "Phase Title",
            "description": "Detailed explanation of why this phase is crucial and what it covers",
            "targetDate": "ISO-8601-Date-String (distribute 1-6 months from now)",
            "milestone": "A clear, measurable outcome",
            "tasks": [
              {
                "name": "Specific Actionable Task",
                "description": "Clear instructions on how to complete this task",
                "targetDate": "ISO-8601-Date-String",
                "estimatedHours": "Number (e.g. 1.5, 2.0)",
                "dimensions": ["skills", "knowledge", etc],
                "attributes": ["focus", "deep_work", etc]
              }
            ]
          }
        ],
        "habits": [
          {
            "title": "Recurring Habit Name",
            "description": "How this habit supports the overall goal",
            "frequency": { "type": "daily" | "weekly", "value": number },
            "estimatedHours": "Number of hours per occurrence",
            "dimensions": ["resilience", etc],
            "attributes": ["discipline", etc]
          }
        ]
      }
      
      Ensure every field is filled with rich, actionable content. Do not leave descriptions empty.
    `;

    const model = process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "deepseek-chat";

    try {
      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "You are a professional Life Architect. You provide detailed, structured JSON plans. Never return empty descriptions." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message.content || '{}';
      const plan = JSON.parse(content);
      
      if (!plan.phases) plan.phases = [];
      if (!plan.habits) plan.habits = [];

      plan.phases = plan.phases.map((p: any) => ({
        title: p.title || p.name || 'Sin título',
        description: p.description || p.desc || '',
        targetDate: p.targetDate || null,
        milestone: p.milestone || '',
        tasks: (p.tasks || []).map((t: any) => {
          const task = typeof t === 'string' ? { name: t } : t;
          return {
            name: task.name || task.title || 'Tarea',
            description: task.description || task.desc || '',
            targetDate: task.targetDate || null,
            estimatedHours: parseFloat(task.estimatedHours) || 1.0,
            dimensions: Array.isArray(task.dimensions) ? task.dimensions : [],
            attributes: Array.isArray(task.attributes) ? task.attributes : []
          };
        })
      }));

      plan.habits = plan.habits.map((h: any) => ({
        title: h.title || h.name || 'Hábito',
        description: h.description || h.desc || '',
        frequency: h.frequency || { type: 'daily', value: 1 },
        estimatedHours: parseFloat(h.estimatedHours) || 0.5,
        dimensions: Array.isArray(h.dimensions) ? h.dimensions : [],
        attributes: Array.isArray(h.attributes) ? h.attributes : []
      }));

      return plan;
    } catch (error) {
      console.error('[GoalService] Error generating plan:', error);
      return {
        phases: [{ 
          title: "Inicio del Plan", 
          description: "Preparación inicial para alcanzar tu meta.",
          targetDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          tasks: [{ name: "Definir objetivos claros", description: "Establecer métricas de éxito para el primer mes." }] 
        }],
        habits: []
      };
    }
  }
}

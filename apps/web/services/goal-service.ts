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
      4. "constraints": An object with "timePerWeek" (number, hours the user mentioned they have) if mentioned, otherwise null.
      5. "entities": Any specific companies, roles, or locations mentioned.
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

  async getUserWorkloadContext(userId: string) {
    const horizon = new Date();
    horizon.setDate(horizon.getDate() + 30);
    
    const workload: Record<string, number> = {};
    
    // 1. Fetch dynamic actions
    const actions = await prisma.goalAction.findMany({
      where: {
        goal: { userId },
        targetDate: { gte: new Date(), lte: horizon }
      },
      select: { targetDate: true, estimatedHours: true }
    });

    actions.forEach(a => {
      if (!a.targetDate) return;
      const key = a.targetDate.toISOString().split('T')[0];
      workload[key] = (workload[key] || 0) + (a.estimatedHours || 0);
    });

    // 2. Fetch static base commitments (Work/Study/Routines)
    const baseCommitments = await prisma.baseCommitment.findMany({
      where: { userId, isActive: true }
    });

    // Project base commitments over the next 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();
      const key = d.toISOString().split('T')[0];

      baseCommitments.forEach(bc => {
        if (bc.daysOfWeek.includes(dayOfWeek)) {
          workload[key] = (workload[key] || 0) + bc.hoursPerDay;
        }
      });
    }

    return workload;
  }

  async generateHierarchicalPlan(parsedGoal: any, dnaAnalysis: any, constraints: any = {}, userId?: string) {
    const { title, description } = parsedGoal;
    const { gap } = dnaAnalysis;
    const now = new Date();
    const timePerWeek = constraints?.timePerWeek || 10;

    let workloadContext = "";
    if (userId) {
      const workload = await this.getUserWorkloadContext(userId);
      workloadContext = `EXISTING WORKLOAD (Hours already scheduled per day):
      ${JSON.stringify(workload)}
      
      INSTRUCTION: Avoid adding tasks on days that already have > 4 hours of work. Distribute the new tasks into the "empty" or "light" days.`;
    }

    console.log(`[GoalService] Generating workload-aware plan for: "${title}"`);

    const prompt = `
      As a Practical Execution Expert, create a highly detailed and structured action plan.
      
      ${workloadContext}
      
      CRITICAL PLANNING CONSTRAINTS:
      - USER AVAILABILITY: The user has ONLY ${timePerWeek} hours per week for this goal.
      - TASK DISTRIBUTION (FRAGMENTATION): If a commitment is repeated (e.g., "4 classes of 1 hour each", "Gym 3 times a week"), do NOT create a single 4-hour task. You MUST create multiple individual sub-tasks, each with its OWN "startDate" and "targetDate" representing the specific day of that session.
      - INSTITUTIONAL PATHS: Include formal steps (Apply, Enroll) for careers.
      - TIME SCALES: Immediate tasks granular; long-term commitment as phases.
      - TASK DURATION LIMIT: NO SINGLE TASK SHOULD EVER EXCEED 4 HOURS. 
      - REASONABLE SPREAD: Distribute tasks across the week. Do not saturate a single day if the user's weekly budget is limited.
      
      GOAL CONTEXT:
      - Title: "${title}"
      - Main Description: ${description}
      - DNA Gaps: ${JSON.stringify(gap)}
      - Today's Date: ${now.toISOString()}
      
      STRICT JSON SCHEMA REQUIREMENT:
      Return ONLY a JSON object with this exact structure:
      {
        "phases": [
          {
            "title": "Phase Title",
            "description": "Why this phase matters",
            "targetDate": "ISO-8601-Date-String",
            "milestone": "Measurable outcome",
            "tasks": [
              {
                "name": "Actionable Task",
                "description": "Specific instructions",
                "startDate": "ISO-8601 (Optional, for multi-day tasks)",
                "targetDate": "ISO-8601",
                "estimatedHours": "Number (Max 4.0 per task)",
                "dimensions": ["skills", etc],
                "attributes": ["focus", etc]
              }
            ]
          }
        ],
        "habits": [
          {
            "title": "Habit Name",
            "description": "Context",
            "frequency": { "type": "daily" | "weekly", "value": number },
            "estimatedHours": "Number (Max 2.0 per session)",
            "dimensions": ["resilience", etc]
          }
        ]
      }
    `;

    const model = process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "deepseek-chat";

    try {
      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "You are a professional Life Architect. You provide detailed, structured JSON plans. You split long tasks into digestible blocks of 1-4 hours." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 4096
      });

      const rawContent = response.choices[0]?.message.content || '{}';
      
      // Clean up markdown if present
      const content = rawContent
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let plan;
      try {
        plan = JSON.parse(content);
      } catch (parseError) {
        console.error("JSON Parse Error in generateHierarchicalPlan:", parseError);
        console.error("Raw Content received:", content);
        // Fallback or re-throw with better context
        throw new Error(`Failed to parse AI plan: ${content.substring(0, 100)}...`);
      }
      
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
            startDate: task.startDate || null,
            targetDate: task.targetDate || null,
            estimatedHours: Math.min(10, parseFloat(task.estimatedHours) || 1.0), // Cap at 10 just for safety
            dimensions: Array.isArray(task.dimensions) ? task.dimensions : [],
            attributes: Array.isArray(task.attributes) ? task.attributes : []
          };
        })
      }));

      plan.habits = plan.habits.map((h: any) => ({
        title: h.title || h.name || 'Hábito',
        description: h.description || h.desc || '',
        frequency: h.frequency || { type: 'daily', value: 1 },
        estimatedHours: Math.min(4, parseFloat(h.estimatedHours) || 0.5),
        dimensions: Array.isArray(h.dimensions) ? h.dimensions : [],
        attributes: Array.isArray(h.attributes) ? h.attributes : []
      }));

      return plan;
    } catch (error) {
      console.error('[GoalService] Error generating plan:', error);
      return {
        phases: [{ 
          title: "Inicio del Plan", 
          description: "Preparación inicial.",
          targetDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          tasks: [{ name: "Definir objetivos", description: "Establecer métricas.", estimatedHours: 1 }] 
        }],
        habits: []
      };
    }
  }
}

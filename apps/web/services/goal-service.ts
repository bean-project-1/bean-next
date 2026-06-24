import { prisma } from '@/lib/prisma';
import { openai, deepseek, getTracedOpenAI, getTracedDeepseek } from '@/lib/openai';
import { getDynamicAIClientByKey, getDynamicModelByKey } from '@/lib/ai-client';

// Removed static GOAL_TYPE_WEIGHTS in favor of dynamic analysis

const DEFAULT_WEIGHTS = {
  personal_growth: 0.5,
  skills: 0.5
};

export class GoalAuditError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoalAuditError';
  }
}

export class GoalService {
  public getClient(config?: any, byokKey?: string, byokProvider?: string) {
    if (byokKey && byokKey.length >= 10) {
      return getDynamicAIClientByKey(byokKey, byokProvider, config);
    }
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
    if (config) {
      return hasOpenAI ? getTracedOpenAI(config) : getTracedDeepseek(config);
    }
    return hasOpenAI ? openai : deepseek;
  }

  /**
   * Resolves which model to call for a given agent, respecting BYOK provider/model
   * mapping (so e.g. a Gemini BYOK key never gets sent a "gpt-4o" model id).
   * `platformModel` is used when running on the platform key; `byokOpenAIModel`
   * (defaults to platformModel) is used when the user's BYOK provider is openai/unset.
   */
  public pickModel(byokKey?: string, byokProvider?: string, platformModel: string = 'gpt-4o-mini', byokOpenAIModel?: string) {
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here';
    const fallback = hasOpenAI ? platformModel : 'deepseek-chat';
    return getDynamicModelByKey(byokKey, byokProvider, fallback, byokOpenAIModel || platformModel);
  }

  /**
   * Calls an LLM expecting a JSON object response. On malformed JSON (or a
   * thrown API error), retries once by feeding the error back to the model
   * instead of failing the whole agent outright.
   */
  private async callJsonAgent(
    client: any,
    model: string,
    system: string,
    userPrompt: string,
    maxTokens?: number,
    retries: number = 1
  ): Promise<any> {
    let messages: any[] = [
      { role: 'system', content: system },
      { role: 'user', content: userPrompt }
    ];
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      let raw = '';
      try {
        const res = await client.chat.completions.create({
          model,
          messages,
          response_format: { type: 'json_object' },
          ...(maxTokens ? { max_tokens: maxTokens } : {})
        });
        raw = res.choices[0]?.message?.content || '{}';
        return JSON.parse(raw.replace(/```json|```/g, '').trim());
      } catch (e: any) {
        lastError = e;
        if (attempt < retries) {
          messages = [
            ...messages,
            ...(raw ? [{ role: 'assistant', content: raw }] : []),
            { role: 'user', content: `Tu respuesta anterior no fue JSON válido (${e.message}). Devuelve ÚNICAMENTE el JSON correcto, sin texto adicional ni markdown.` }
          ];
        }
      }
    }
    throw lastError;
  }


  async parseGoalWithAI(text: string, userId?: string, byokKey?: string, byokProvider?: string) {
    let dnaContext = "No user DNA attributes specified.";
    if (userId) {
      const attributes = await prisma.userAttribute.findMany({
        where: { userId },
        include: { dimension: true }
      });
      if (attributes.length > 0) {
        dnaContext = "USER DNA ATTRIBUTES (Current starting assets/skills):\n" + 
          attributes.map(a => `- ${a.dimension.label} (${a.category}): ${a.name}`).join('\n');
      }
    }

    const prompt = `
      Analyze the following user goal intention: "${text}"
      
      ${dnaContext}
      
      Return a JSON object with:
      1. "title": A concise, inspiring title for the goal.
      2. "description": A short explanation of the goal.
      3. "relevantDimensions": An array of strings representing which areas of life this goal affects (e.g., "career", "health", "knowledge", "skills", "social_capital"). Choose 2-4.
      4. "constraints": An object with:
         - "timePerWeek": (number) hours the user mentioned they have.
         - "budgetTotal": (number) total budget mentioned, if any.
         - "savingsPerMonth": (number) amount the user is willing to save per month, if any.
         - "targetDate": (string) specific target date (YYYY-MM) if mentioned.
      5. "entities": Any specific companies, roles, or locations mentioned.
      6. "estimatedDurationMonths": (number) A highly realistic estimate of how many months this goal typically takes to achieve in the real world (e.g., becoming a General Doctor = 72 to 84 months; becoming a Neurosurgeon or medical specialist = 120 to 144 months; climbing Everest = 24 to 36 months; obtaining a cloud certification = 3 to 6 months). If the user provided a targetDate or savingsPerMonth, use those to calculate the exact duration (e.g., Cost / savingsPerMonth).
      7. "complexityLevel": (string) "low", "medium", "high", or "extreme".
      8. "domainExpertiseNeeded": (string) A comma-separated list of technical/domain knowledge needed.
      9. "startingAssets": (array of strings) The user's DNA attributes/skills that are relevant to this goal and can serve as a base (from USER DNA ATTRIBUTES). If none are relevant, return an empty array.
      10. "dnaAnalysisInsight": (string) A short explanation in Spanish of what the user already has as a base according to their DNA, and where they are starting from (e.g., "Dado que ya tienes conocimientos en React, no iniciaremos desde cero. El plan se enfocará en...").
    `;

    const model = this.pickModel(byokKey, byokProvider, 'gpt-4o-mini');
    const client = this.getClient({
      userId: userId,
      tags: ["agent:goal-architect", `env:${process.env.NODE_ENV || 'development'}`]
    }, byokKey, byokProvider);

    try {
      return await this.callJsonAgent(client, model, "You are a Goal Architecture AI. Return JSON only.", prompt);
    } catch (error) {
      console.error('Error parsing goal with AI:', error);
      // Fallback — flagged so callers can short-circuit instead of running the
      // full pipeline on an intent the AI never actually understood.
      return {
        title: text,
        description: `Plan para: ${text}`,
        relevantDimensions: ["skills", "knowledge"],
        startingAssets: [],
        dnaAnalysisInsight: "",
        _parseFailed: true
      };
    }
  }

  async getUserDNA(userId: string) {
    // We no longer use LifeState scores. Instead we derive a basic presence
    // score based on the number of attributes the user has registered in each dimension.
    const attributes = await prisma.userAttribute.findMany({
      where: { userId },
      include: { dimension: true }
    });

    const dnaMap: Record<string, number> = {};
    attributes.forEach(attr => {
      if (attr.dimension?.name) {
        // Cap the basic presence score to avoid over-inflation
        dnaMap[attr.dimension.name] = Math.min(80, (dnaMap[attr.dimension.name] || 20) + 10); 
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
    
    const dailyHours: Record<string, number> = {};
    
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
      dailyHours[key] = (dailyHours[key] || 0) + (a.estimatedHours || 0);
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
          dailyHours[key] = (dailyHours[key] || 0) + bc.hoursPerDay + ((bc as any).commuteHours || 0);
        }
      });
    }

    const commitmentsSummary = baseCommitments.map(bc => 
      `- ${bc.title} (${bc.type}): ${bc.hoursPerDay}h/día ${((bc as any).commuteHours) ? `+ ${(bc as any).commuteHours}h transporte` : ''} (${bc.daysOfWeek.length} días/sem)`
    );

    return {
      dailyHours,
      commitmentsSummary
    };
  }

  async auditGoalResources(parsedGoal: any, userId?: string, chatContext: string = '', byokKey?: string, byokProvider?: string) {
    let workloadContext = "Unknown workload";
    if (userId) {
      const workload = await this.getUserWorkloadContext(userId);
      workloadContext = `EXISTING SCHEDULE: ${JSON.stringify(workload.dailyHours)}`;
    }
 
    const timePerWeek = parsedGoal.constraints?.timePerWeek || 10;
    const targetDate = parsedGoal.constraints?.targetDate || "Unknown";
    const budget = parsedGoal.constraints?.budgetTotal || "Unknown";
    
    const prompt = `
      Actúa como un Auditor de Viabilidad Realista. Evalúa si la siguiente meta es matemática y físicamente posible de lograr dadas las restricciones de recursos y los acuerdos recientes de la conversación.
      
      META: "${parsedGoal.title}" - ${parsedGoal.description}
      COMPLEJIDAD: ${parsedGoal.complexityLevel || 'medium'}
      
      RECURSOS DISPONIBLES:
      - Tiempo asignado: ${timePerWeek} horas por semana.
      - Fecha límite esperada: ${targetDate}
      - Presupuesto: ${budget}
      - Agenda actual ocupada del usuario: ${workloadContext}
      
      CONTEXTO RECIENTE DE LA CONVERSACIÓN (ACUERDOS RECIENTES):
      ${chatContext || 'Sin historial reciente de conversación.'}
      
      IMPORTANTE:
      - Si en el chat el usuario y el coach ya acordaron explícitamente esta disponibilidad y plazo para esta meta (o para una versión acotada de la misma, como por ejemplo hacer un portafolio básico de 3 proyectos en lugar de ser un profesional senior de inmediato), debes considerarlo VIABLE ("isViable": true) para no contradecir lo pactado y evitar ciclos infinitos de rechazo.
      - Si la matemática de verdad NO da y NO se ha discutido en el chat, o si es absurdamente imposible bajo cualquier supuesto (ej. ser neurocirujano o aprender medicina en 1 mes), entonces recházalo.
      
      Si debes rechazarlo, redacta un "renegotiationMessage" dirigiéndote al usuario en primera persona del plural (como si fueras el equipo del coach). Ofrece opciones conversacionales. Ejemplo: "Analicé nuestra meta con el equipo de planificación y los números no dan para lograrlo en 2 meses con 5 horas a la semana. Toma unas 300 horas en total. ¿Qué te parece si extendemos la fecha a Diciembre, o subimos a 15 horas semanales?"
      
      Devuelve ÚNICAMENTE un JSON:
      {
        "isViable": boolean,
        "reason": "Internal logic",
        "renegotiationMessage": "Mensaje para el usuario (vacío si es viable)"
      }
    `;
 
    const client = this.getClient({ userId, tags: ["agent:resource-audit"] }, byokKey, byokProvider);
    const model = this.pickModel(byokKey, byokProvider, 'gpt-4o-mini');
 
    try {
      return await this.callJsonAgent(client, model, "You are a strict resource auditor.", prompt);
    } catch (e) {
      console.error('[ResourceAudit] Error:', e);
      return { isViable: true, reason: "Parse error", renegotiationMessage: "" };
    }
  }

  // ─────────────────────────────────────────────────────────
  // AGENT 1: Analyst — Detects starting point & feasibility
  // ─────────────────────────────────────────────────────────
  async analyzeGoalOrigin(
    parsedGoal: any,
    dnaAnalysis: any,
    constraints: any,
    teamContext: string,
    chatContext: string,
    byokKey?: string,
    byokProvider?: string
  ): Promise<{
    origin: string;
    startingAssets: { dimension: string; attribute: string; relevance: string }[];
    gaps: string[];
    feasibility: 'ok' | 'tight' | 'unrealistic';
    feasibilityNote: string;
    estimatedMonths: number;
    warnings: string[];
  }> {
    const { title, description, startingAssets = [], dnaAnalysisInsight = '' } = parsedGoal;
    const timePerWeek = constraints.timePerWeek || 5;
    const targetDate = constraints.targetDate || 'No definida';

    const prompt = `You are a Goal Feasibility Analyst. Analyze the user's starting point.

GOAL: "${title}" — ${description}
WEEKLY AVAILABILITY: ${timePerWeek} hours/week
TARGET DATE: ${targetDate}
USER DNA (existing skills/attributes): ${JSON.stringify(startingAssets)}
DNA ANALYSIS INSIGHT: ${dnaAnalysisInsight}
${teamContext ? `TEAM MEMBERS:\n${teamContext}` : ''}
${chatContext ? `CONVERSATION CONTEXT (what was agreed):\n${chatContext.slice(0, 2000)}` : ''}

Analyze strictly and realistically:
1. What does the user ALREADY HAVE from their DNA that's relevant? (list it as startingAssets)
2. What are the GAPS they must develop?
3. Given ${timePerWeek}h/week and the target date, is this FEASIBLE?
   - "ok": achievable with the given time
   - "tight": possible but will require strict discipline
   - "unrealistic": not possible — the goal requires significantly more time or has a longer natural duration
4. Realistic estimated duration in months for this goal in the real world

Return ONLY valid JSON (no markdown):
{
  "origin": "1-2 sentence description of where the user starts from",
  "startingAssets": [{"dimension": "skills", "attribute": "Programming", "relevance": "Allows skipping basic coding setup phases"}],
  "gaps": ["Gap 1", "Gap 2"],
  "feasibility": "ok" | "tight" | "unrealistic",
  "feasibilityNote": "Brief explanation of feasibility assessment in Spanish",
  "estimatedMonths": 6,
  "warnings": ["Warning if any, in Spanish"]
}`;

    const client = this.getClient({ tags: ['agent:analyst'] }, byokKey, byokProvider);
    const model = this.pickModel(byokKey, byokProvider, 'gpt-4o-mini');

    try {
      return await this.callJsonAgent(
        client,
        model,
        'You are a precise goal feasibility analyst. Return only valid JSON.',
        prompt,
        1024
      );
    } catch (e) {
      console.error('[Agent1:Analyst] Error:', e);
      return {
        origin: dnaAnalysisInsight || 'Punto de partida no determinado.',
        startingAssets: [],
        gaps: [],
        feasibility: 'ok',
        feasibilityNote: 'Análisis no disponible, se continúa con el plan.',
        estimatedMonths: 6,
        warnings: []
      };
    }
  }

  // ─────────────────────────────────────────────────────────
  // Extracts a structured phase outline from a raw chat transcript, so the
  // Architect gets data to extend rather than prose it's told not to deviate
  // from. Returns null if there's nothing to extract or the call fails.
  // ─────────────────────────────────────────────────────────
  async extractAgreedOutline(
    chatContext: string,
    byokKey?: string,
    byokProvider?: string
  ): Promise<{ phases: { title: string; description: string }[] } | null> {
    if (!chatContext || !chatContext.trim()) return null;

    const prompt = `The following is a conversation between a user and an AI life coach negotiating a goal plan.
Extract ONLY the phases/stages the two of them explicitly agreed on, if any. Do not invent phases that were not discussed.
If no specific phases were agreed upon (e.g. they only discussed hours/deadline/identity), return an empty "phases" array.

CONVERSATION:
${chatContext.slice(0, 4000)}

Return ONLY valid JSON:
{ "phases": [{ "title": "Phase title as agreed", "description": "1-sentence summary of what was agreed for this phase" }] }`;

    const client = this.getClient({ tags: ['agent:outline-extractor'] }, byokKey, byokProvider);
    const model = this.pickModel(byokKey, byokProvider, 'gpt-4o-mini');

    try {
      const result = await this.callJsonAgent(
        client,
        model,
        'You extract structured agreements from conversations. Return only valid JSON.',
        prompt,
        800
      );
      return { phases: Array.isArray(result.phases) ? result.phases : [] };
    } catch (e) {
      console.error('[OutlineExtractor] Error:', e);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  // AGENT 2: Architect — Designs phases & tasks only
  // ─────────────────────────────────────────────────────────
  async generatePhasesAndTasks(
    parsedGoal: any,
    dnaAnalysis: any,
    originAnalysis: any,
    constraints: any,
    teamContext: string,
    agreedOutline: { phases: { title: string; description: string }[] } | null,
    previousDraft?: any,
    revisionInstructions?: string,
    byokKey?: string,
    byokProvider?: string
  ): Promise<any> {
    const { title, description } = parsedGoal;
    const { gap } = dnaAnalysis;
    const timePerWeek = constraints.timePerWeek || 5;
    const targetDate = constraints.targetDate || '';
    const now = new Date();

    const outlineBlock = (agreedOutline && agreedOutline.phases.length > 0) ? `
AGREED PHASE OUTLINE (extracted from the coaching conversation — the user already confirmed these phases):
${JSON.stringify(agreedOutline.phases, null, 2)}

RULE: Use these phases as the backbone of the plan. You may refine titles/dates and you MUST fill in the tasks for each one, but do not drop them or replace them with different phases.
` : '';

    const prevDraftBlock = previousDraft ? `
PREVIOUS DRAFT (modify according to REVISION INSTRUCTIONS below):
${JSON.stringify(previousDraft).slice(0, 3000)}

REVISION INSTRUCTIONS: ${revisionInstructions}
RULE: Preserve any element with "isCompleted": true exactly as-is. Only change non-completed elements.
` : '';

    const teamBlock = teamContext ? `
TEAM MEMBERS (assign tasks based on their role and DNA):
${teamContext}

ASSIGNMENT RULES:
- Assign every task to exactly ONE team member using "assigneeId" (their exact user ID from above)
- If task B directly depends on task A because of knowledge continuity (e.g., same course, same specialization chain), set requiresSameAssignee: true and dependencyType: "same_person_required"
- If task B is blocked until task A is done but can be done by anyone, set dependencyType: "blocks"
- If dependency is loose, set dependencyType: "soft"
` : 'Assign all tasks to the main user (no team).';

    const prompt = `${outlineBlock}

You are a Goal Architect. Create a REALISTIC, STRUCTURED plan with phases and tasks.

GOAL: "${title}" — ${description}
WEEKLY AVAILABILITY: ${timePerWeek} hours/week
TARGET DATE: ${targetDate || 'Flexible'}
TODAY: ${now.toISOString()}

STARTING POINT (from Analyst):
- Origin: ${originAnalysis.origin}
- Starting Assets: ${JSON.stringify(originAnalysis.startingAssets)}
- Gaps to close: ${JSON.stringify(originAnalysis.gaps)}
- Feasibility: ${originAnalysis.feasibility} — ${originAnalysis.feasibilityNote}
- Realistic duration: ${originAnalysis.estimatedMonths} months

SKILL GAPS: ${JSON.stringify(gap)}

${teamBlock}
${prevDraftBlock}

RULES (CRITICAL):
1. DO NOT include phases the user already completed based on their starting assets
2. Each task must have: name, description, estimatedHours, targetDate (ISO), startDate (optional)
3. For each task, set:
   - "needsSubtasks": true if it can be broken into ≤1.5h steps (e.g., "Configure environment", "Research competitors")
   - "needsSubtasks": false if it's indivisible (e.g., "Bike 6 hours", "Attend university class", "Study Medicine career")
   - "isLongTerm": true if it's a recurring commitment over days/weeks (e.g., "Study marketing daily", "Practice coding 3x/week") — these become BaseCommitments
   - "isLongTerm": false for one-off tasks
4. Long-term tasks (isLongTerm=true) must include: frequency {type, value}, daysOfWeek[], startDate, endDate, type (work|study|routine)
5. Spread tasks realistically across the timeline — do NOT compress a 6-month goal into 2 weeks
6. No limits on phases or tasks — include as many as needed for a complete plan

Return ONLY valid JSON:
{
  "title": "Goal title",
  "description": "Goal description",
  "analysis": {
    "identityShift": "Who the user needs to become",
    "reverseEngineering": "Step-by-step breakdown from end to start",
    "resourceAudit": "Assessment of skills, time, and resources"
  },
  "phases": [
    {
      "title": "Phase title",
      "description": "Why this phase matters",
      "targetDate": "ISO date",
      "milestone": {
        "title": "Measurable outcome",
        "description": "What must be demonstrated",
        "evaluationType": "text | image | document | questionnaire | none",
        "evaluationInstructions": "What the user must provide"
      },
      "tasks": [
        {
          "name": "Task name",
          "description": "Specific details",
          "estimatedHours": 2,
          "startDate": "ISO date (optional)",
          "targetDate": "ISO date",
          "assigneeId": "userId (team only, exact ID from TEAM MEMBERS)",
          "requiresSameAssignee": false,
          "dependencyType": "blocks | same_person_required | soft | none",
          "dimensions": ["skills"],
          "attributes": [],
          "needsSubtasks": true,
          "isLongTerm": false,
          "frequency": null,
          "daysOfWeek": [],
          "commitmentType": null
        }
      ]
    }
  ]
}`;

    const client = this.getClient({ tags: ['agent:architect'] }, byokKey, byokProvider);
    const model = this.pickModel(byokKey, byokProvider, 'gpt-4o');

    try {
      const plan = await this.callJsonAgent(
        client,
        model,
        'You are a professional Goal Architect. Return only valid JSON. No markdown.',
        prompt,
        6000
      );
      if (!plan.phases) plan.phases = [];
      if (!plan.analysis) plan.analysis = { identityShift: '', reverseEngineering: '', resourceAudit: '' };
      return plan;
    } catch (e) {
      console.error('[Agent2:Architect] Error:', e);
      return { title, description, analysis: {}, phases: [] };
    }
  }

  // ─────────────────────────────────────────────────────────
  // AGENT 3: Enricher — Adds subtasks & BaseCommitment metadata
  // ─────────────────────────────────────────────────────────
  async enrichWithSubtasks(
    draft: any,
    byokKey?: string,
    byokProvider?: string
  ): Promise<any> {
    // Collect only tasks that need enrichment
    const tasksNeedingSubtasks = draft.phases.flatMap((p: any, pi: number) =>
      (p.tasks || [])
        .map((t: any, ti: number) => ({ task: t, phaseIdx: pi, taskIdx: ti }))
        .filter(({ task }: any) => task.needsSubtasks && !task.isLongTerm && (task.estimatedHours || 0) > 1.5)
    );

    if (tasksNeedingSubtasks.length === 0) {
      // Nothing to enrich — just normalize
      return this.normalizeDraft(draft);
    }

    // Build a compact representation for the enricher
    const tasksForEnricher = tasksNeedingSubtasks.map(({ task, phaseIdx, taskIdx }: any) => ({
      phaseIdx,
      taskIdx,
      name: task.name,
      description: task.description,
      estimatedHours: task.estimatedHours
    }));

    const prompt = `You are a Task Enricher. Your ONLY job is to break down tasks into granular subtasks.

TASKS TO BREAK DOWN:
${JSON.stringify(tasksForEnricher, null, 2)}

RULES (CRITICAL):
- Each subtask must be a specific, actionable step taking MAX 1.5 hours
- Subtasks must be concrete (e.g., "Install Node.js and verify version", "Read chapter 3 of Clean Code")
- Do NOT rename or change the parent tasks
- Return EXACTLY the same phaseIdx and taskIdx from input

Return ONLY valid JSON:
{
  "enriched": [
    {
      "phaseIdx": 0,
      "taskIdx": 0,
      "subTasks": [
        { "name": "Step name", "description": "Details", "estimatedHours": 1.0 }
      ]
    }
  ]
}`;

    const client = this.getClient({ tags: ['agent:enricher'] }, byokKey, byokProvider);
    const model = this.pickModel(byokKey, byokProvider, 'gpt-4o-mini');

    try {
      const enriched = await this.callJsonAgent(
        client,
        model,
        'You are a Task Enricher. Return only valid JSON. No markdown.',
        prompt,
        4096
      );

      // Inject subtasks back into draft
      for (const item of (enriched.enriched || [])) {
        const phase = draft.phases[item.phaseIdx];
        if (!phase) continue;
        const task = phase.tasks?.[item.taskIdx];
        if (!task) continue;
        task.subTasks = (item.subTasks || []).map((st: any) => ({
          name: st.name || 'Sub-tarea',
          description: st.description || '',
          estimatedHours: Math.min(1.5, parseFloat(st.estimatedHours) || 1.0)
        }));
      }
    } catch (e) {
      console.error('[Agent3:Enricher] Error:', e);
      // Continue without subtasks — not fatal
    }

    return this.normalizeDraft(draft);
  }

  // ─────────────────────────────────────────────────────────
  // Normalize draft: validate types, extract habits/continuousProjects
  // ─────────────────────────────────────────────────────────
  private normalizeDraft(draft: any): any {
    const habits: any[] = [];
    const continuousProjects: any[] = [];

    draft.phases = (draft.phases || []).map((p: any) => ({
      title: p.title || p.name || 'Sin título',
      description: p.description || '',
      targetDate: p.targetDate || null,
      milestone: p.milestone || { title: 'Completar fase', evaluationType: 'none' },
      tasks: (p.tasks || []).map((t: any) => {
        const task = typeof t === 'string' ? { name: t } : t;

        // Long-term tasks → extract as BaseCommitment equivalent
        if (task.isLongTerm) {
          const commitmentType = task.commitmentType || task.type || 'study';
          const validType = ['work', 'study', 'routine'].includes(commitmentType) ? commitmentType : 'study';
          if (task.frequency) {
            habits.push({
              title: task.name || task.title || 'Compromiso',
              description: task.description || '',
              type: validType,
              frequency: task.frequency || { type: 'daily', value: 1 },
              daysOfWeek: Array.isArray(task.daysOfWeek) ? task.daysOfWeek.map(Number) : [],
              estimatedHours: Math.min(4, parseFloat(task.estimatedHours) || 1.0),
              startDate: task.startDate || null,
              endDate: task.targetDate || task.endDate || null,
              dimensions: Array.isArray(task.dimensions) ? task.dimensions : []
            });
          } else {
            continuousProjects.push({
              title: task.name || task.title || 'Proyecto Continuo',
              description: task.description || '',
              type: validType,
              daysOfWeek: Array.isArray(task.daysOfWeek) ? task.daysOfWeek.map(Number) : [1, 2, 3, 4, 5],
              estimatedHours: Math.min(8, parseFloat(task.estimatedHours) || 2.0),
              startDate: task.startDate || null,
              endDate: task.targetDate || task.endDate || null,
              dimensions: Array.isArray(task.dimensions) ? task.dimensions : []
            });
          }
        }

        return {
          name: task.name || task.title || 'Tarea',
          description: task.description || task.desc || '',
          startDate: task.startDate || null,
          targetDate: task.targetDate || null,
          estimatedHours: Math.min(200, parseFloat(task.estimatedHours) || 1.0),
          assigneeId: task.assigneeId || null,
          requiresSameAssignee: !!task.requiresSameAssignee,
          dependencyType: task.dependencyType || null,
          isLongTermTask: !!task.isLongTerm,
          dimensions: Array.isArray(task.dimensions) ? task.dimensions : [],
          attributes: Array.isArray(task.attributes) ? task.attributes : [],
          subTasks: Array.isArray(task.subTasks) ? task.subTasks.map((st: any) => ({
            name: st.name || st.title || 'Sub-tarea',
            description: st.description || st.desc || '',
            estimatedHours: Math.min(1.5, parseFloat(st.estimatedHours) || 1.0)
          })) : []
        };
      })
    }));

    draft.habits = habits;
    draft.continuousProjects = continuousProjects;
    if (!draft.analysis) draft.analysis = { identityShift: '', reverseEngineering: '', resourceAudit: '' };

    return draft;
  }

  // ─────────────────────────────────────────────────────────
  // ORCHESTRATOR: Coordinates the 3 agents in sequence
  // ─────────────────────────────────────────────────────────
  async generateHierarchicalPlan(
    parsedGoal: any,
    dnaAnalysis: any,
    constraints: any = {},
    userId?: string,
    previousDraft?: any,
    revisionInstructions?: string,
    byokKey?: string,
    byokProvider?: string,
    onProgress?: (event: { type: string; step?: number; label?: string; status?: string; data?: any }) => void
  ): Promise<{ draft: any; diagnosis: any }> {
    const teamContext = constraints.teamContext || '';
    const chatContext = constraints.chatContext || '';

    const emit = (event: any) => { if (onProgress) onProgress(event); };

    // ── Agent 1: Analyst ──
    emit({ type: 'step', step: 1, label: 'Analizando tu punto de partida...', status: 'active' });
    const diagnosis = await this.analyzeGoalOrigin(
      parsedGoal, dnaAnalysis, constraints, teamContext, chatContext, byokKey, byokProvider
    );
    emit({ type: 'diagnosis', data: diagnosis });
    emit({ type: 'step', step: 1, status: 'done' });

    console.log('[Orchestrator] Diagnosis:', JSON.stringify(diagnosis));

    // If unrealistic, return early for negotiation
    if (diagnosis.feasibility === 'unrealistic' && !previousDraft) {
      emit({ type: 'negotiation_needed', diagnosis });
      return { draft: null as any, diagnosis };
    }

    // ── Agent 2: Architect ──
    const agreedOutline = await this.extractAgreedOutline(chatContext, byokKey, byokProvider);
    emit({ type: 'step', step: 2, label: 'Diseñando fases y tareas...', status: 'active' });
    const roughDraft = await this.generatePhasesAndTasks(
      parsedGoal, dnaAnalysis, diagnosis, constraints, teamContext, agreedOutline,
      previousDraft, revisionInstructions, byokKey, byokProvider
    );
    emit({ type: 'step', step: 2, status: 'done' });

    // ── Agent 3: Enricher ──
    emit({ type: 'step', step: 3, label: 'Desgranando subtareas...', status: 'active' });
    const finalDraft = await this.enrichWithSubtasks(roughDraft, byokKey, byokProvider);
    emit({ type: 'step', step: 3, status: 'done' });

    return { draft: finalDraft, diagnosis };
  }

  /**
   * Shifting logic for Goal Tree (Dynamic Branch Recalculation).
   * Shifts the start and target dates of a GoalAction by a specific number of days,
   * and cascades this shift to all actions that depend on it.
   */
  async shiftActionAndDependencies(actionId: string, daysToShift: number) {
    if (daysToShift === 0) return { success: true, processedCount: 0 };

    const queue: string[] = [actionId];
    const processed = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (processed.has(currentId)) continue;
      processed.add(currentId);

      const action = await prisma.goalAction.findUnique({
        where: { id: currentId }
      });

      if (!action) continue;

      // 1. Shift associated BaseCommitments first (using original action dates before modification)
      if (action.goalId) {
        const associatedCommitments = await prisma.baseCommitment.findMany({
          where: { goalId: action.goalId, isActive: true }
        });

        for (const bc of associatedCommitments) {
          const bcUpdates: any = {};
          
          if (bc.startDate && action.startDate) {
            const bcStartDay = bc.startDate.toISOString().split('T')[0];
            const actionStartDay = new Date(action.startDate).toISOString().split('T')[0];
            if (bcStartDay === actionStartDay) {
              const newBcStart = new Date(bc.startDate);
              newBcStart.setDate(newBcStart.getDate() + daysToShift);
              bcUpdates.startDate = newBcStart;
            }
          }

          if (bc.endDate && action.targetDate) {
            const bcEndDay = bc.endDate.toISOString().split('T')[0];
            const actionTargetDay = new Date(action.targetDate).toISOString().split('T')[0];
            if (bcEndDay === actionTargetDay) {
              const newBcEnd = new Date(bc.endDate);
              newBcEnd.setDate(newBcEnd.getDate() + daysToShift);
              bcUpdates.endDate = newBcEnd;
            }
          }

          if (Object.keys(bcUpdates).length > 0) {
            await prisma.baseCommitment.update({
              where: { id: bc.id },
              data: bcUpdates
            });
          }
        }
      }

      // 2. Prepare action updates
      const dataToUpdate: any = {};
      if (action.startDate) {
        const newStart = new Date(action.startDate);
        newStart.setDate(newStart.getDate() + daysToShift);
        dataToUpdate.startDate = newStart;
      }
      
      if (action.targetDate) {
        const newTarget = new Date(action.targetDate);
        newTarget.setDate(newTarget.getDate() + daysToShift);
        dataToUpdate.targetDate = newTarget;
      }

      if (Object.keys(dataToUpdate).length > 0) {
        await prisma.goalAction.update({
          where: { id: currentId },
          data: dataToUpdate
        });
      }

      // Find dependent actions (children in the DAG)
      const dependents = await prisma.goalAction.findMany({
        where: {
          dependsOn: {
            has: currentId
          }
        },
        select: { id: true }
      });

      for (const dep of dependents) {
        if (!processed.has(dep.id)) {
          queue.push(dep.id);
        }
      }
    }
    
    return { success: true, processedCount: processed.size };
  }
}

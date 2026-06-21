import { prisma } from '@/lib/prisma';
import { openai, deepseek, getTracedOpenAI, getTracedDeepseek } from '@/lib/openai';

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
  public getClient(config?: any) {
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
    if (config) {
      return hasOpenAI ? getTracedOpenAI(config) : getTracedDeepseek(config);
    }
    return hasOpenAI ? openai : deepseek;
  }


  async parseGoalWithAI(text: string, userId?: string) {
    const prompt = `
      Analyze the following user goal intention: "${text}"
      
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
    `;

    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
    const model = hasOpenAI ? "gpt-4o-mini" : "deepseek-chat";
    const client = this.getClient({
      userId: userId,
      tags: ["agent:goal-architect", `env:${process.env.NODE_ENV || 'development'}`]
    });

    try {
      const response = await client.chat.completions.create({
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

  async auditGoalResources(parsedGoal: any, userId?: string) {
    let workloadContext = "Unknown workload";
    if (userId) {
      const workload = await this.getUserWorkloadContext(userId);
      workloadContext = `EXISTING SCHEDULE: ${JSON.stringify(workload.dailyHours)}`;
    }

    const timePerWeek = parsedGoal.constraints?.timePerWeek || 10;
    const targetDate = parsedGoal.constraints?.targetDate || "Unknown";
    const budget = parsedGoal.constraints?.budgetTotal || "Unknown";
    
    const prompt = `
      Actúa como un Auditor de Viabilidad Realista. Evalúa si la siguiente meta es matemática y físicamente posible de lograr dadas las restricciones de recursos.
      
      META: "${parsedGoal.title}" - ${parsedGoal.description}
      COMPLEJIDAD: ${parsedGoal.complexityLevel || 'medium'}
      
      RECURSOS DISPONIBLES:
      - Tiempo asignado: ${timePerWeek} horas por semana.
      - Fecha límite esperada: ${targetDate}
      - Presupuesto: ${budget}
      - Agenda actual ocupada del usuario: ${workloadContext}
      
      Si la matemática NO da (ej. requiere 1000 horas pero a ${timePerWeek}h/semana tomaría años y la fecha límite es en 2 meses), debes rechazarlo.
      
      Si debes rechazarlo, redacta un "renegotiationMessage" dirigiéndote al usuario en primera persona del plural (como si fueras el equipo del coach). Ofrece opciones conversacionales. Ejemplo: "Analicé nuestra meta con el equipo de planificación y los números no dan para lograrlo en 2 meses con 5 horas a la semana. Toma unas 300 horas en total. ¿Qué te parece si extendemos la fecha a Diciembre, o subimos a 15 horas semanales?"
      
      Devuelve ÚNICAMENTE un JSON:
      {
        "isViable": boolean,
        "reason": "Internal logic",
        "renegotiationMessage": "Mensaje para el usuario (vacío si es viable)"
      }
    `;

    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
    const client = this.getClient({ userId, tags: ["agent:resource-audit"] });
    
    const response = await client.chat.completions.create({
      model: hasOpenAI ? "gpt-4o-mini" : "deepseek-chat",
      messages: [{ role: "system", content: "You are a strict resource auditor." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    try {
      const raw = response.choices[0]?.message?.content || '{}';
      return JSON.parse(raw);
    } catch {
      return { isViable: true, reason: "Parse error", renegotiationMessage: "" };
    }
  }

  async generateHierarchicalPlan(parsedGoal: any, dnaAnalysis: any, constraints: any = {}, userId?: string, previousDraft?: any, revisionInstructions?: string) {
    const { title, description } = parsedGoal;
    const { gap } = dnaAnalysis;
    const now = new Date();
    const timePerWeek = constraints?.timePerWeek || 10;

    let workloadContext = "";
    if (userId) {
      const workload = await this.getUserWorkloadContext(userId);
      workloadContext = `EXISTING SCHEDULE & ROUTINES:
      ${workload.commitmentsSummary.join('\n')}
      
      TOTAL OCCUPIED HOURS PER DAY (Including sleep/work):
      ${JSON.stringify(workload.dailyHours)}
      
      INSTRUCTION: Avoid adding tasks on days that already have > 22 hours occupied (including sleep). Distribute the new tasks into the "empty" or "light" days where (24 - occupied) >= task estimated hours.`;
    }

    console.log(`[GoalService] Generating workload-aware plan for: "${title}" (Complexity: ${parsedGoal.complexityLevel})`);

    const financialContext = parsedGoal.constraints?.budgetTotal || parsedGoal.constraints?.savingsPerMonth 
      ? `- FINANCIAL CONSTRAINTS: Budget: ${parsedGoal.constraints.budgetTotal || 'Unknown'}. Savings Capacity: ${parsedGoal.constraints.savingsPerMonth || 'Unknown'} per month. Target Date: ${parsedGoal.constraints.targetDate || 'Unknown'}. You MUST create explicit "Milestone" or "Task" items in the phases for saving money (e.g., "Ahorro Mes 1: $X", "Abrir cuenta de inversión"). The duration of the plan MUST stretch logically to allow the user to save the required budget based on their monthly capacity.`
      : `- FINANCIAL CONSTRAINTS: None specified. Assume standard costs, but if it's an expensive goal, add a phase for "Financial Planning & Funding".`;

    const prompt = `
      As a World-Class Practical Execution Expert and Domain Specialist, create a highly realistic and structured action plan.
      
      ${workloadContext}

      ${previousDraft ? `
      PREVIOUS DRAFT:
      ${JSON.stringify(previousDraft)}
      
      REVISION INSTRUCTIONS FROM USER:
      ${revisionInstructions}
      
      INSTRUCTION: Modify the PREVIOUS DRAFT strictly according to the REVISION INSTRUCTIONS. 
      CRITICAL RULE FOR PREVIOUS DRAFTS: Any element (phase, task, subtask, habit, project) that has an "id" AND "isCompleted": true MUST BE PRESERVED EXACTLY AS IS. Do not modify, remove, or change its dates. You may add, remove, or modify elements that are NOT completed. For elements you preserve from the previous draft, you MUST include their original "id" and "isCompleted" flags in your JSON output.
      ` : ''}
      
      
      CRITICAL PLANNING CONSTRAINTS & REALISM:
      - USER AVAILABILITY: The user has ONLY ${timePerWeek} hours per week for this goal.
      ${financialContext}
      - REALISTIC SCALE: This goal has a complexity level of [${parsedGoal.complexityLevel || 'medium'}] and is estimated to take ${parsedGoal.estimatedDurationMonths || 6} months. DO NOT compress a multi-year goal into a few weeks. Spread the phases realistically over the estimated duration.
      - DOMAIN EXPERTISE REQUIRED: ${parsedGoal.domainExpertiseNeeded || 'General knowledge'}. You MUST apply deep domain realism. For example, if the goal is climbing Everest, you must include financial planning, acclimatization, technical ice training, and previous expedition tests (e.g. Aconcagua). If it's becoming a Senior Developer, include deep architectural study, system design, and real-world project deployments.
      
      - PROFESSIONAL/ACADEMIC PATHS (CRITICAL): If the goal is a highly regulated professional career (e.g., Doctor, Neurosurgeon, Lawyer, Commercial Pilot), the plan MUST strictly reflect the actual sequence of phases and timeline required in the real world. For example, for a Neurosurgeon, there must be a phase for General Medicine (typically 60-72 months) followed by a phase for Specialization (typically 36-48 months), each with their corresponding study/work routines. Do NOT compress these regulated durations.
      
      - ACADEMIC/SEMESTER TIMING (CRITICAL): For formal education phases (like university semesters or school terms), align the start dates with standard academic terms (e.g., standard semesters start in February/March or August/September, choosing the next upcoming term start date relative to today's date).
      
      - PHASE-SPECIFIC ROUTINES & DATES (CRITICAL): Habits and recurring projects MUST NOT span the entire goal duration if they only apply to a specific phase. You MUST define their "startDate" and "endDate" to align strictly with the specific Phase or time period they run in. For example, study habits for medical school must start at the beginning of the Medicine phase and end when that phase ends; specialization habits must only start at the beginning of the Specialization phase and end when it ends.
      
      - LONG-TERM REPETITION (ROUTINES AS BASE COMMITMENTS): For activities that repeat over months (e.g., "Gym 3 times a week", "Read 30 mins daily"), DO NOT create individual tasks. You MUST create them as "habits" or "continuousProjects" in their respective arrays. They will be registered in the system as "Compromisos Base" (Base Commitments) of type "study", "work", or "routine".
      
      - PREREQUISITE RECURRING COMMITMENTS (CRITICAL): If a recurring commitment (e.g., studying a language, learning a technical skill, daily training) is a PREREQUISITE for subsequent tasks in the plan, you MUST create a dedicated "Phase" in the plan representing that preparation/prerequisite stage (e.g., "Fase 1: Estudio de Fundamentos de React"). Set the phase's targetDate to match the end date of that recurring project/habit. Subsequent tasks and phases must depend on this prerequisite phase.
      
      - DEFINITION OF HIERARCHY (PHASE vs TASK vs SUB-TASK):
        1. "Phase" (Fase): A major chronological stage or milestone of the goal (e.g., "Fase 1: Preparación y Estudio", "Fase 2: Construcción de Prototipo"). If a recurring commitment is a prerequisite, it must define or align with a Phase.
        2. "Task" (Tarea): Specific deliverables or achievements that happen within a phase. These MUST be unique, non-repeating events (e.g., "Inscribirse en el semestre", "Rendir examen final de anatomía", "Presentar tesis"). DO NOT create generic, long-term tasks representing the overall process itself (e.g., "Estudiar la carrera de Medicina", "Completar la residencia", "Trabajar en la empresa"). Those efforts are represented by the Phase timeline itself and by the corresponding recurring base commitments (habits or continuous projects).
        3. "Sub-task" (Subtarea): Actionable, granular steps of 1 to 1.5 hours maximum (e.g., "Instalar Node.js", "Ver videos de la sección 1"). You MUST include sub-tasks for any complex task.
        
      - TASK DISTRIBUTION & SUB-TASKS (CRITICAL): Tasks can take longer than 1 hour IF they represent a larger block. HOWEVER, if a task is generic or takes > 1 hour, you MUST include a "subTasks" array inside it. Each subTask must be HIGHLY specific, actionable, and take MAX 1.5 HOURS.
      - INSTITUTIONAL PATHS: Include formal steps (Apply, Enroll) for careers.
      - REASONABLE SPREAD: Distribute tasks logically across the timeline.
      
      GOAL CONTEXT:
      - Title: "${title}"
      - Main Description: ${description}
      - DNA Gaps: ${JSON.stringify(gap)}
      - Today's Date: ${now.toISOString()}
      
      STRICT JSON SCHEMA REQUIREMENT:
      Return ONLY a JSON object with this exact structure:
      {
        "analysis": {
          "identityShift": "Description of the identity shift required for the user (who do they need to become on a daily basis to achieve this, e.g., 'someone who studies coding 30 mins a day')",
          "reverseEngineering": "Step-by-step reasoning decomposing the macro goal (Years/Months -> Quarters -> Weeks -> Days) based on constraints and timeline",
          "resourceAudit": "Auditing needed skills/knowledge, budget, and time availability/workload context to ensure viability"
        },
        "phases": [
          {
            "id": "String (Only if preserving an existing phase)",
            "isCompleted": "Boolean (Only if preserving an existing phase)",
            "title": "Phase Title",
            "description": "Why this phase matters",
            "targetDate": "ISO-8601-Date-String",
            "milestone": {
              "title": "Measurable outcome title",
              "description": "Detailed description of the outcome",
              "evaluationType": "text | image | document | questionnaire | none",
              "evaluationInstructions": "Specific instructions on what the user must provide (e.g. 'Sube una foto de tu certificado', 'Escribe un párrafo sobre lo que aprendiste')"
            },
            "tasks": [
              {
                "id": "String (Only if preserving an existing task)",
                "isCompleted": "Boolean (Only if preserving an existing task)",
                "name": "Task Name (e.g. Enroll in semester, Submit exam application, Defend thesis proposal)",
                "description": "Specific instructions",
                "startDate": "ISO-8601 (Optional, for multi-day tasks)",
                "targetDate": "ISO-8601",
                "estimatedHours": "Number (Total hours for the task)",
                "dimensions": ["skills", etc],
                "attributes": ["focus", etc],
                "subTasks": [
                  {
                    "id": "String (Only if preserving an existing subtask)",
                    "isCompleted": "Boolean (Only if preserving an existing subtask)",
                    "name": "Granular step (e.g. Gather transcripts, Fill registration form)",
                    "description": "Details",
                    "estimatedHours": "Number (Max 1.5)"
                  }
                ]
              }
            ]
          }
        ],
        "habits": [
          {
            "title": "Habit Name",
            "description": "Context",
            "type": "work | study | routine", // choose: 'study' if the habit is to learn/acquire knowledge; 'work' if it relates to professional/productive output; 'routine' if it is wellness, health, sleep or lifestyle.
            "frequency": { "type": "daily" | "weekly", "value": number },
            "daysOfWeek": [1, 3, 5], // array of integers 0-6 (0 is Sunday, 1 is Monday, etc.) representing which days this habit should run, matching the frequency.
            "estimatedHours": "Number (Max 2.0 per session)",
            "startDate": "ISO-8601-Date-String (start date of the specific phase this habit runs in)",
            "endDate": "ISO-8601-Date-String (end date of the specific phase this habit runs in)",
            "dimensions": ["resilience", etc]
          }
        ],
        "continuousProjects": [
          {
            "title": "Project Name (recurrent long-term task)",
            "description": "Detailed context",
            "type": "work | study | routine", // choose: 'study' if the project is to learn/acquire skills; 'work' if it relates to professional/productive work; 'routine' if it is health, wellness, sleep or lifestyle.
            "daysOfWeek": [1, 2, 3, 4, 5], // array of integers 0-6 representing days of week dedicated to this project
            "estimatedHours": "Number (hours per session, max 4.0)",
            "startDate": "ISO-8601-Date-String (start of phase)",
            "endDate": "ISO-8601-Date-String (end of phase)",
            "dimensions": ["skills", etc]
          }
        ]
      }
    `;

    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
    const model = hasOpenAI ? "gpt-4o-mini" : "deepseek-chat";
    const client = this.getClient({
      userId: userId,
      tags: ["agent:goal-architect", `env:${process.env.NODE_ENV || 'development'}`]
    });

    try {
      const response = await client.chat.completions.create({
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
      
      if (!plan.analysis) {
        plan.analysis = {
          identityShift: "",
          reverseEngineering: "",
          resourceAudit: ""
        };
      }
      if (!plan.phases) plan.phases = [];
      if (!plan.habits) plan.habits = [];
      if (!plan.continuousProjects) plan.continuousProjects = [];

      plan.phases = plan.phases.map((p: any) => ({
        title: p.title || p.name || 'Sin título',
        description: p.description || p.desc || '',
        targetDate: p.targetDate || null,
        milestone: p.milestone || { title: 'Completar phase', evaluationType: 'none' },
        tasks: (p.tasks || []).map((t: any) => {
          const task = typeof t === 'string' ? { name: t } : t;
          return {
            name: task.name || task.title || 'Tarea',
            description: task.description || task.desc || '',
            startDate: task.startDate || null,
            targetDate: task.targetDate || null,
            estimatedHours: Math.min(100, parseFloat(task.estimatedHours) || 1.0),
            dimensions: Array.isArray(task.dimensions) ? task.dimensions : [],
            attributes: Array.isArray(task.attributes) ? task.attributes : [],
            subTasks: Array.isArray(task.subTasks) ? task.subTasks.map((st: any) => ({
              name: st.name || st.title || 'Sub-tarea',
              description: st.description || st.desc || '',
              estimatedHours: Math.min(4, parseFloat(st.estimatedHours) || 1.0)
            })) : []
          };
        })
      }));

      plan.habits = plan.habits.map((h: any) => {
        let type = h.type || 'routine';
        if (type !== 'work' && type !== 'study' && type !== 'routine') {
          type = 'routine';
        }
        return {
          title: h.title || h.name || 'Hábito',
          description: h.description || h.desc || '',
          type,
          frequency: h.frequency || { type: 'daily', value: 1 },
          daysOfWeek: Array.isArray(h.daysOfWeek) && h.daysOfWeek.length > 0 ? h.daysOfWeek.map(Number) : [],
          estimatedHours: Math.min(4, parseFloat(h.estimatedHours) || 0.5),
          startDate: h.startDate || null,
          endDate: h.endDate || null,
          dimensions: Array.isArray(h.dimensions) ? h.dimensions : [],
          attributes: Array.isArray(h.attributes) ? h.attributes : []
        };
      });

      plan.continuousProjects = plan.continuousProjects.map((cp: any) => {
        let type = cp.type || 'routine';
        if (type !== 'work' && type !== 'study' && type !== 'routine') {
          type = 'routine';
        }
        return {
          title: cp.title || cp.name || 'Proyecto Continuo',
          description: cp.description || cp.desc || '',
          type,
          daysOfWeek: Array.isArray(cp.daysOfWeek) && cp.daysOfWeek.length > 0 ? cp.daysOfWeek.map(Number) : [],
          estimatedHours: Math.min(8, parseFloat(cp.estimatedHours) || 1.0),
          startDate: cp.startDate || null,
          endDate: cp.endDate || null,
          dimensions: Array.isArray(cp.dimensions) ? cp.dimensions : []
        };
      });

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

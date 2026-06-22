import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { GoalService, GoalAuditError } from '@/services/goal-service';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  let sessionId = null;
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await req.json();
    const { finalGoalInput, chatHistory, userEmail, branchData } = body;
    sessionId = body.sessionId;
    const byokKey = req.cookies.get('bean_byok_key')?.value;

    // 1. Resolve User
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    
    if (!user && userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
    }

    // Fallback for dev if no user found yet
    if (!user) {
      user = await prisma.user.findFirst();
      console.log('[GoalGenerate] No user found via cookie/email, using fallback:', user?.email);
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please log in.' }, { status: 404 });
    }

    const goalService = new GoalService();

    // 2. Build Goal Intent
    let goalText = finalGoalInput;
    const rawChat = chatHistory ? chatHistory.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n') : '';
    
    if (branchData) {
      console.log('[GoalGenerate] Using explicit branchData constraints from Agent:', branchData);
      goalText = `Meta: ${branchData.goalTitle || finalGoalInput}
Dimensión: ${branchData.dimensionName || 'General'}
RESTRICCIONES MATEMÁTICAS A RESPETAR ESTRICTAMENTE:
- Horas semanales disponibles: ${branchData.hoursPerWeek}
- Fecha objetivo: ${branchData.targetDate}
- Presupuesto mensual: ${branchData.budget || 0}

[CONVERSACIÓN DE CONTEXTO]:
${rawChat}`;
    } else if (!goalText || goalText.includes('Resumen de lo que quiero') || goalText.length < 10) {
      console.log('[GoalGenerate] Distilling goal from chat history...');
      const distillationPrompt = `
        Based on the following conversation between a user and a life coach, summarize the user's OVERARCHING goal and vision.
        
        CRITICAL: Do not just output the final message or the first step discussed. Capture the MACRO goal (e.g. "Conocer las 7 maravillas del mundo moderno") AND any specific details, phases, or first steps they agreed upon.
        ALSO CRITICAL: If the user mentioned any FINANCIAL BUDGET, SAVINGS CAPACITY (e.g., "$200 per month"), or a SPECIFIC TARGET DATE, you MUST explicitly include them in your summary.
        
        Return a comprehensive sentence or short paragraph describing the full intent, including time and money constraints if present.
        
        CONVERSATION:
        ${rawChat}
      `;
      
      const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
      const client = goalService.getClient({
        userId: user.id,
        tags: ["agent:goal-generate", `env:${process.env.NODE_ENV || 'development'}`]
      }, byokKey);
      const distillationRes = await client.chat.completions.create({
        model: hasOpenAI ? "gpt-4o-mini" : "deepseek-chat",
        messages: [{ role: "system", content: "You are a Goal Distiller AI." }, { role: "user", content: distillationPrompt }]
      });
      
      goalText = (distillationRes.choices[0]?.message?.content || 'Mi nueva meta') + `\n\n[RAW CONVERSATION CONTEXT FOR EXACT DETAILS/ASSETS]:\n${rawChat}`;
    } else {
      goalText = goalText + `\n\n[RAW CONVERSATION CONTEXT FOR EXACT DETAILS/ASSETS]:\n${rawChat}`;
    }

    console.log(`[GoalGenerate] User: ${user.email} | Distilled Intent: "${goalText.substring(0, 200)}..."`);

    // 3. Unified Pipeline
    const parsedGoal = await goalService.parseGoalWithAI(goalText, user.id, byokKey);
    const userDNA = await goalService.getUserDNA(user.id);
    const dnaAnalysis = goalService.computeDNAAnalysis(parsedGoal.relevantDimensions, userDNA);

    // 3.5 Resource Audit
    if (!body.draftPlan) {
      const auditResult = await goalService.auditGoalResources(parsedGoal, user.id, byokKey);
      if (!auditResult.isViable && auditResult.renegotiationMessage) {
        console.log(`[GoalGenerate] Audit failed on final save: ${auditResult.renegotiationMessage}`);
        // We no longer throw GoalAuditError here to allow the save of the plan
      }
    }

    const plan = body.draftPlan || await goalService.generateHierarchicalPlan(parsedGoal, dnaAnalysis, parsedGoal.constraints, user.id, undefined, undefined, byokKey);

    // 4. Resolve Dimension
    const primaryDimName = parsedGoal.relevantDimensions?.[0] || 'career';
    const dimension = await prisma.dimension.findFirst({
      where: { 
        OR: [
          { name: { contains: primaryDimName, mode: 'insensitive' } },
          { label: { contains: primaryDimName, mode: 'insensitive' } }
        ]
      }
    });

    console.log(`[GoalGenerate] Creating plan: ${plan.phases?.length} phases, ${plan.habits?.length} habits. Dimension: ${dimension?.label || 'None'}`);

    // 5. Persist
    const result = await prisma.$transaction(async (tx) => {
      
      // Inject raw chat history into constraints for future reference
      const finalConstraints = (parsedGoal.constraints || {}) as any;
      finalConstraints.rawChatHistory = chatHistory;
      if (plan.analysis) {
        finalConstraints.analysis = plan.analysis;
      }

      // Create Goal
      const goal = await tx.goal.create({
        data: {
          userId: user.id,
          title: parsedGoal.title,
          description: parsedGoal.description,
          dimensionId: dimension?.id,
          readinessScore: dnaAnalysis.readinessScore,
          constraints: finalConstraints,
          target: {
            dimensions: dnaAnalysis.targetDimensions,
            gap: dnaAnalysis.gap
          }
        }
      });

      // Create Actions
      for (const phaseData of plan.phases) {
        const phase = await tx.goalAction.create({
          data: {
            goalId: goal.id,
            title: phaseData.title,
            description: phaseData.description || null,
            type: 'phase',
            targetDate: phaseData.targetDate ? new Date(phaseData.targetDate) : null
          }
        });

        if (phaseData.tasks && phaseData.tasks.length > 0) {
          for (const t of phaseData.tasks) {
            const createdTask = await tx.goalAction.create({
              data: {
                goalId: goal.id,
                parentId: phase.id,
                title: t.name,
                description: t.description || null,
                type: 'task',
                startDate: t.startDate ? new Date(t.startDate) : null,
                targetDate: t.targetDate ? new Date(t.targetDate) : null,
                estimatedHours: t.estimatedHours || 0,
                dimensions: t.dimensions || [],
                attributes: t.attributes || []
              }
            });

            if (t.subTasks && t.subTasks.length > 0) {
              const subTasksData = t.subTasks.map((st: any) => ({
                goalActionId: createdTask.id,
                title: st.name,
                description: st.description || null,
                estimatedHours: st.estimatedHours || 0
              }));
              await tx.task.createMany({ data: subTasksData });
            }
          }
        }

        if (phaseData.milestone) {
          const m = phaseData.milestone;
          const milestoneTitle = typeof m === 'string' ? m : (m.title || 'Hito Final');
          const milestoneDesc = typeof m === 'object' ? m.description : null;
          const evaluationType = typeof m === 'object' ? (m.evaluationType || 'none') : 'none';
          const evaluationInstructions = typeof m === 'object' ? m.evaluationInstructions : null;

          await tx.goalAction.create({
            data: {
              goalId: goal.id,
              parentId: phase.id,
              title: milestoneTitle,
              description: milestoneDesc,
              type: 'milestone',
              impact: {
                evaluationType,
                evaluationInstructions
              }
            }
          });
        }
      }

      // Helper function for fallback days
      const getFallbackDaysOfWeek = (days: any[], freq: any) => {
        if (Array.isArray(days) && days.length > 0) return days.map(Number);
        if (!freq) return [1, 2, 3, 4, 5];
        if (freq.type === 'daily') return [1, 2, 3, 4, 5, 6, 0];
        const val = freq.value || 1;
        if (val >= 7) return [1, 2, 3, 4, 5, 6, 0];
        if (val === 6) return [1, 2, 3, 4, 5, 6];
        if (val === 5) return [1, 2, 3, 4, 5];
        if (val === 4) return [1, 2, 4, 5];
        if (val === 3) return [1, 3, 5];
        if (val === 2) return [2, 4];
        return [1];
      };

      // Habits -> Base Commitments
      if (plan.habits && plan.habits.length > 0) {
        for (const habitData of plan.habits) {
          let resolvedDims: string[] = [];
          if (habitData.dimensions && Array.isArray(habitData.dimensions)) {
            const dims = await tx.dimension.findMany({ where: { name: { in: habitData.dimensions } } });
            resolvedDims = dims.map(d => d.id);
          }

          await tx.baseCommitment.create({
            data: {
              userId: user.id,
              goalId: goal.id,
              title: habitData.title,
              description: habitData.description || null,
              type: habitData.type || 'routine',
              frequency: habitData.frequency || null,
              estimatedHours: habitData.estimatedHours || 0,
              attributes: habitData.attributes || [],
              daysOfWeek: getFallbackDaysOfWeek(habitData.daysOfWeek, habitData.frequency),
              startDate: habitData.startDate ? new Date(habitData.startDate) : new Date(),
              endDate: habitData.endDate ? new Date(habitData.endDate) : (plan.phases?.[plan.phases.length - 1]?.targetDate ? new Date(plan.phases[plan.phases.length - 1].targetDate) : null),
              dimensionIds: resolvedDims,
              dimensions: {
                connect: resolvedDims.map(id => ({ id }))
              }
            }
          });
        }
      }

      // Continuous Projects -> Base Commitments
      if (plan.continuousProjects && plan.continuousProjects.length > 0) {
        for (const cpData of plan.continuousProjects) {
          let resolvedDims: string[] = [];
          if (cpData.dimensions && Array.isArray(cpData.dimensions)) {
            const dims = await tx.dimension.findMany({ where: { name: { in: cpData.dimensions } } });
            resolvedDims = dims.map(d => d.id);
          }

          await tx.baseCommitment.create({
            data: {
              userId: user.id,
              goalId: goal.id,
              title: cpData.title,
              description: cpData.description || null,
              type: cpData.type || 'routine',
              estimatedHours: cpData.estimatedHours || 1.0,
              daysOfWeek: getFallbackDaysOfWeek(cpData.daysOfWeek, { type: 'weekly', value: cpData.daysOfWeek?.length || 3 }),
              startDate: cpData.startDate ? new Date(cpData.startDate) : new Date(),
              endDate: cpData.endDate ? new Date(cpData.endDate) : (plan.phases?.[plan.phases.length - 1]?.targetDate ? new Date(plan.phases[plan.phases.length - 1].targetDate) : null),
              dimensionIds: resolvedDims,
              dimensions: {
                connect: resolvedDims.map(id => ({ id }))
              }
            }
          });
        }
      }

      return goal;
    }, {
      timeout: 40000, // 40 seconds
      maxWait: 10000  // 10 seconds
    });

    return NextResponse.json({ success: true, goal: result, plan });

  } catch (error: any) {
    if (error instanceof GoalAuditError) {
      console.log('[GoalGenerate] Audit Failed, sending renegotiation message:', error.message);
      if (sessionId) {
        await prisma.chatMessage.create({
          data: {
            sessionId: sessionId,
            role: 'assistant',
            content: error.message
          }
        });
      }
      return NextResponse.json({ success: false, auditFailed: true, message: error.message });
    }

    console.error('[POST /api/ai/goal-generate] FATAL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

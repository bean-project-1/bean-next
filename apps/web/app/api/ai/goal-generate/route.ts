import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoalService } from '@/services/goal-service';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    const body = await req.json();
    const { finalGoalInput, chatHistory, userEmail } = body;

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
    
    // If the input is the placeholder from the frontend or too generic, distill from chat
    if (!goalText || goalText.includes('Resumen de lo que quiero') || goalText.length < 10) {
      console.log('[GoalGenerate] Distilling goal from chat history...');
      const distillationPrompt = `
        Based on the following conversation, what is the user's PRIMARY goal? 
        Return ONLY a short sentence describing the goal (e.g. "Ser panadero profesional").
        
        CONVERSATION:
        ${chatHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n')}
      `;
      
      const distillationRes = await goalService.openai.chat.completions.create({
        model: process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "deepseek-chat",
        messages: [{ role: "system", content: "You are a Goal Distiller AI." }, { role: "user", content: distillationPrompt }]
      });
      
      goalText = distillationRes.choices[0]?.message?.content || 'Mi nueva meta';
    }

    console.log(`[GoalGenerate] User: ${user.email} | Distilled Intent: "${goalText}"`);

    // 3. Unified Pipeline
    const parsedGoal = await goalService.parseGoalWithAI(goalText);
    const userDNA = await goalService.getUserDNA(user.id);
    const dnaAnalysis = goalService.computeDNAAnalysis(parsedGoal.relevantDimensions, userDNA);
    const plan = await goalService.generateHierarchicalPlan(parsedGoal, dnaAnalysis);

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
      // Create Goal
      const goal = await tx.goal.create({
        data: {
          userId: user.id,
          title: parsedGoal.title,
          description: parsedGoal.description,
          dimensionId: dimension?.id,
          readinessScore: dnaAnalysis.readinessScore,
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

        if (phaseData.tasks) {
          for (const t of phaseData.tasks) {
            await tx.goalAction.create({
              data: {
                goalId: goal.id,
                parentId: phase.id,
                title: t.name,
                description: t.description || null,
                type: 'task',
                targetDate: t.targetDate ? new Date(t.targetDate) : null,
                estimatedHours: t.estimatedHours || 0,
                dimensions: t.dimensions || [],
                attributes: t.attributes || []
              }
            });
          }
        }

        if (phaseData.milestone) {
          await tx.goalAction.create({
            data: {
              goalId: goal.id,
              parentId: phase.id,
              title: phaseData.milestone,
              type: 'milestone'
            }
          });
        }
      }

      // Habits
      if (plan.habits) {
        for (const habitData of plan.habits) {
          await tx.goalAction.create({
            data: {
              goalId: goal.id,
              title: habitData.title,
              description: habitData.description || null,
              type: 'habit',
              frequency: habitData.frequency || null,
              estimatedHours: habitData.estimatedHours || 0,
              dimensions: habitData.dimensions || [],
              attributes: habitData.attributes || []
            }
          });
        }
      }

      return goal;
    });

    return NextResponse.json({ success: true, goal: result, plan });

  } catch (error: any) {
    console.error('[POST /api/ai/goal-generate] FATAL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =======================================================
// BEAN — Public Goal Draft Planner API
// apps/web/app/api/goals/draft-plan/route.ts
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { GoalService } from '@/services/goal-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Text input is required' }, { status: 400 });
    }

    const goalService = new GoalService();

    console.log(`[GoalDraftPipeline] Public drafting started: "${text}"`);
    
    // 1. Parse goal intent with AI
    const parsedGoal = await goalService.parseGoalWithAI(text);
    
    // 2. Mock an empty user DNA profile for unauthenticated drafting (defaults will be applied by computeDNAAnalysis)
    const mockUserDNA: Record<string, number> = {};
    
    // 3. Compute base DNA analysis and gaps
    const dnaAnalysis = goalService.computeDNAAnalysis(parsedGoal.relevantDimensions, mockUserDNA);
    
    // 4. Generate master plan with multi-agent system
    const { draft: plan } = await goalService.generateHierarchicalPlan(
      parsedGoal,
      dnaAnalysis,
      parsedGoal.constraints,
      "anonymous"
    );

    console.log(`[GoalDraftPipeline] Public drafting finished successfully: "${plan.name || parsedGoal.title}"`);

    return NextResponse.json({
      success: true,
      planSummary: plan
    });

  } catch (err: any) {
    console.error('[API Goals Draft-Plan]', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate plan draft',
      detail: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

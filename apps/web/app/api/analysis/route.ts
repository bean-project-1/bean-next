// =======================================================
// BEAN — API Route: POST /api/analysis
// apps/web/app/api/analysis/route.ts
//
// Triggers AI analysis for a user's profile.
// Returns dimension scores, life score, and trajectory.
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiResponse, AnalysisResponse } from '@bean/types';

// Import AI engine (will resolve at runtime for server-side only)
// import { analyzeProfile } from '@bean/ai-engine';

const analysisRequestSchema = z.object({
  userId: z.string().optional(),
  profileId: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<AnalysisResponse>>> {
  try {
    const body = await req.json();

    const parsed = analysisRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // TODO: Fetch profile from DB
    // const profile = await prisma.beanProfile.findUnique({ where: { userId } });

    // TODO: Run AI analysis
    // const analysis = await analyzeProfile({ userId, profile });

    // Mock response
    const mockAnalysis: AnalysisResponse = {
      lifeScore: 70,
      dimensionScores: [
        { key: 'values', label: 'Values', value: 7.5, trend: 'stable' },
        { key: 'interests', label: 'Interests', value: 8.0, trend: 'up' },
        { key: 'knowledge', label: 'Knowledge', value: 7.0, trend: 'up' },
        { key: 'skills', label: 'Skills', value: 7.5, trend: 'up' },
        { key: 'career', label: 'Career', value: 6.0, trend: 'stable' },
        { key: 'income', label: 'Income', value: 5.5, trend: 'stable' },
        { key: 'health', label: 'Health', value: 7.0, trend: 'up' },
        { key: 'relationships', label: 'Relationships', value: 7.5, trend: 'stable' },
        { key: 'happiness', label: 'Happiness', value: 6.5, trend: 'up' },
      ],
      insights: [],
      generatedAt: new Date(),
    };

    // TODO: Persist lifeState snapshot
    // await prisma.lifeState.create({ data: { userId, lifeScore: mockAnalysis.lifeScore, dimensionScores: mockAnalysis.dimensionScores, triggeredBy: 'ai_analysis' } });

    return NextResponse.json({ success: true, data: mockAnalysis });
  } catch (err) {
    console.error('[POST /api/analysis]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

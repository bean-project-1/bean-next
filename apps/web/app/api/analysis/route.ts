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
        { name: 'values', label: 'Values', category: 'identity', score: 7.5, trend: 'stable' },
        { name: 'interests', label: 'Interests', category: 'identity', score: 8.0, trend: 'up' },
        { name: 'knowledge', label: 'Knowledge', category: 'capital', score: 7.0, trend: 'up' },
        { name: 'skills', label: 'Skills', category: 'capital', score: 7.5, trend: 'up' },
        { name: 'career', label: 'Career', category: 'capital', score: 6.0, trend: 'stable' },
        { name: 'income', label: 'Income', category: 'capital', score: 5.5, trend: 'stable' },
        { name: 'health', label: 'Health', category: 'capital', score: 7.0, trend: 'up' },
        { name: 'relationships', label: 'Relationships', category: 'experience', score: 7.5, trend: 'stable' },
        { name: 'happiness', label: 'Happiness', category: 'experience', score: 6.5, trend: 'up' },
      ],
      pillars: [],
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

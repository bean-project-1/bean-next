// =======================================================
// BEAN — API Route: POST /api/insights
// apps/web/app/api/insights/route.ts
//
// Generates AI insights for a given user profile.
// Returns prioritized, actionable insights.
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiResponse, Insight } from '@bean/types';

const insightsRequestSchema = z.object({
  userId: z.string().optional(),
  limit: z.number().min(1).max(20).optional().default(5),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<Insight[]>>> {
  try {
    const body = await req.json();

    const parsed = insightsRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { limit } = parsed.data;

    // TODO: Fetch profile and call AI engine
    // const profile = await prisma.beanProfile.findUnique({ where: { userId } });
    // const insights = await generateInsights({ userId, profile });

    const now = new Date();
    const mockInsights: Insight[] = [
      {
        id: '1',
        type: 'strength',
        title: 'Strong intellectual foundation',
        body: 'Your knowledge and skills are tracking above average. Leverage them to accelerate your career trajectory.',
        dimensionName: 'skills',
        priority: 2,
        suggestedAction: 'Identify 2–3 high-leverage projects that use your top skills.',
      },
      {
        id: '2',
        type: 'gap',
        title: 'Income potential not fully realized',
        body: 'Your income score lags behind your skills score. The market likely values your skills higher than your current compensation.',
        dimensionName: 'income',
        priority: 1,
        suggestedAction: 'Research market rates for your role and prepare a compensation conversation.',
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Wellbeing is your growth catalyst',
        body: 'Investing in health and relationships has a compounding effect on all other dimensions.',
        dimensionName: 'health',
        priority: 2,
        suggestedAction: 'Schedule consistent exercise and one meaningful social interaction per week.',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockInsights.slice(0, limit),
    });
  } catch (err) {
    console.error('[POST /api/insights]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// ---- GET insights for current user ----

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Insight[]>>> {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') ?? '5', 10);

    // TODO: Auth + DB fetch
    return NextResponse.json(
      { success: false, error: 'Not implemented yet', code: 'NOT_IMPLEMENTED' },
      { status: 501 }
    );
  } catch (err) {
    console.error('[GET /api/insights]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

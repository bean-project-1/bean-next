// =======================================================
// BEAN — PATCH /api/profile/dimensions
// apps/web/app/api/profile/dimensions/route.ts
//
// Updates dimension scores for the current user's BeanProfile.
// Called from the /dna page "Save" button.
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../../lib/generated-prisma');

export async function PATCH(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const updates: { key: string; score: number }[] = body.dimensionScores ?? [];

    // Get all dimension records to map names to IDs
    const dimensions = await prisma.dimension.findMany();
    const dimMap = new Map(dimensions.map(d => [d.name, d.id]));
    console.log(`[PATCH] Found ${dimensions.length} dimensions for mapping.`);

    // Create a new LifeState snapshot with embedded scores
    const lifeScore = updates.reduce((sum, u) => sum + u.score, 0) / (updates.length || 1);
    
    const newLifeState = await (prisma as any).lifeState.create({
      data: {
        userId,
        lifeScore,
        balanceScore: 60,     // More realistic placeholder
        alignmentScore: 80,   // More realistic placeholder
        energyIndex: 65,      // More realistic placeholder
        triggeredBy: 'dna_update',
        timestamp: new Date(),
        scores: updates
          .filter(u => dimMap.has(u.key))
          .map(u => ({
            dimensionId: dimMap.get(u.key)!,
            score: u.score,
            trend: 'stable'
          })),
      },
    });
    console.log(`[PATCH] New LifeState created: ${newLifeState.id} for user ${userId}`);

    return NextResponse.json({ success: true as const, data: { updated: updates.length } });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[PATCH /api/profile/dimensions]', msg);
    return NextResponse.json({ success: false, error: 'Internal error', detail: msg }, { status: 500 });
  }
}

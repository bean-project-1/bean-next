// =======================================================
// BEAN — PATCH /api/profile/dimensions
// apps/web/app/api/profile/dimensions/route.ts
//
// Updates dimension scores for the current user's BeanProfile.
// Called from the /dna page "Save" button.
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
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

    // Create a new LifeState snapshot with embedded scores
    const lifeScore = updates.reduce((sum, u) => sum + u.score, 0) / (updates.length || 1) * 10;
    
    await prisma.lifeState.create({
      data: {
        userId,
        lifeScore,
        balanceScore: 0.5,     // Placeholder
        alignmentScore: 0.5,   // Placeholder
        energyIndex: 0.5,      // Placeholder
        triggeredBy: 'dna_update',
        scores: updates
          .filter(u => dimMap.has(u.key))
          .map(u => ({
            dimensionId: dimMap.get(u.key)!,
            score: u.score,
            trend: 'stable'
          })),
      },
    });

    return NextResponse.json({ success: true as const, data: { updated: updates.length } });

  } catch (err) {
    console.error('[PATCH /api/profile/dimensions]', err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

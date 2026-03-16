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

    // Get the user's profile
    const profile = await prisma.beanProfile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    // Get all dimension records
    const dimensions = await prisma.dimension.findMany({
      where: { name: { in: updates.map(u => u.key) } },
    });

    const dimMap = new Map(dimensions.map(d => [d.name, d.id]));

    // Upsert each dimension score
    await Promise.all(
      updates
        .filter(u => dimMap.has(u.key))
        .map(u =>
          prisma.dimensionScore.upsert({
            where: {
              profileId_dimensionId: {
                profileId: profile.id,
                dimensionId: dimMap.get(u.key)!,
              },
            },
            create: {
              profileId: profile.id,
              dimensionId: dimMap.get(u.key)!,
              score: Math.min(10, Math.max(0, u.score)),
              trend: 'stable',
            },
            update: {
              score: Math.min(10, Math.max(0, u.score)),
            },
          })
        )
    );

    // Create a new LifeState snapshot
    const lifeScore = updates.reduce((sum, u) => sum + u.score, 0) / (updates.length || 1) * 10;
    await prisma.lifeState.create({
      data: {
        userId,
        lifeScore,
        triggeredBy: 'dna_update',
        scores: {
          create: updates
            .filter(u => dimMap.has(u.key))
            .map(u => ({
              dimensionId: dimMap.get(u.key)!,
              score: u.score,
            })),
        },
      },
    });

    return NextResponse.json({ success: true as const, data: { updated: updates.length } });

  } catch (err) {
    console.error('[PATCH /api/profile/dimensions]', err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

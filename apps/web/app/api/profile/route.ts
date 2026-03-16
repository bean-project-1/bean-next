// =======================================================
// BEAN — API Route: POST + GET /api/profile
// apps/web/app/api/profile/route.ts
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setUserCookie } from '@/lib/session';

// ── Validation ─────────────────────────────────────────
const onboardingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  profession: z.string().default(''),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  exerciseFrequency: z.string().default(''),
  lifeSatisfaction: z.number().min(0).max(10).default(5),
  // Extra dimension scores from the Review phase sliders
  dimensionExtras: z
    .array(z.object({ key: z.string(), score: z.number().min(0).max(10) }))
    .default([]),
});

// Map onboarding fields → dimension keys + initial score
function buildDimScores(
  data: z.infer<typeof onboardingSchema>
): { key: string; score: number }[] {
  const results: { key: string; score: number }[] = [];

  if (data.profession)
    results.push({ key: 'career', score: 7 });
  if (data.skills.length)
    results.push({ key: 'skills', score: Math.min(10, 5 + data.skills.length * 0.5) });
  if (data.interests.length)
    results.push({ key: 'interests', score: Math.min(10, 5 + data.interests.length * 0.5) });
  if (data.exerciseFrequency) {
    const map: Record<string, number> = {
      Rarely: 2, '1–2x/week': 5, '3–4x/week': 7, '5+x/week': 9, Daily: 10,
    };
    results.push({ key: 'physical_health', score: map[data.exerciseFrequency] ?? 5 });
  }
  if (data.lifeSatisfaction !== undefined && data.lifeSatisfaction !== null)
    results.push({ key: 'mental_wellbeing', score: data.lifeSatisfaction });

  // Merge extras from the Review phase (extras override auto-derived)
  const extraKeys = new Set(data.dimensionExtras.map(e => e.key));
  const base = results.filter(r => !extraKeys.has(r.key));
  const extras = data.dimensionExtras
    .filter(e => e.score > 0)
    .map(e => ({ key: e.key, score: e.score }));

  return [...base, ...extras];
}

// ── POST — Onboarding: create User + BeanProfile + DimensionScores ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Validation failed' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Upsert User
    let isNewUser = false;
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    const user = existing
      ? await prisma.user.update({ where: { email: data.email }, data: { name: data.name } })
      : await (async () => { isNewUser = true; return prisma.user.create({ data: { email: data.email, name: data.name } }); })();

    // 2. Upsert BeanProfile — v2 schema has no JSON blob columns
    const profile = await prisma.beanProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    // 3. Persist dimension scores in the relational DimensionScore table
    const dimScores = buildDimScores(data);

    if (dimScores.length > 0) {
      const dimensions = await prisma.dimension.findMany({
        where: { name: { in: dimScores.map(d => d.key) } },
      });
      const dimMap = new Map(dimensions.map(d => [d.name, d.id]));

      await Promise.all(
        dimScores
          .filter(ds => dimMap.has(ds.key))
          .map(ds =>
            prisma.dimensionScore.upsert({
              where: {
                profileId_dimensionId: {
                  profileId: profile.id,
                  dimensionId: dimMap.get(ds.key)!,
                },
              },
              create: {
                profileId: profile.id,
                dimensionId: dimMap.get(ds.key)!,
                score: ds.score,
                trend: 'stable',
              },
              update: { score: ds.score },
            })
          )
      );
    }

    // 4. Create initial LifeState snapshot (no scores nested — kept simple)
    const lifeScore =
      dimScores.length > 0
        ? (dimScores.reduce((s, d) => s + d.score, 0) / dimScores.length) * 10
        : data.lifeSatisfaction * 10;

    await prisma.lifeState.create({
      data: { userId: user.id, lifeScore, triggeredBy: 'onboarding' },
    });

    // 5. Set session cookie
    const res = NextResponse.json(
      { success: true as const, data: { userId: user.id, profileId: profile.id, isNewUser } },
      { status: 201 }
    );
    setUserCookie(res, user.id);
    return res;

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/profile]', msg);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create profile',
        // Show full error in dev for debugging
        detail: process.env.NODE_ENV !== 'production' ? msg : undefined,
      },
      { status: 500 }
    );
  }
}

// ── GET — Fetch current user + profile + dimension scores ──
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            // ← Deep include: scores with their Dimension metadata
            dimensionScores: {
              include: { dimension: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user, profile: user.profile },
    });

  } catch (err) {
    console.error('[GET /api/profile]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

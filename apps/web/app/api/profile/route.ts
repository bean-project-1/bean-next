// =======================================================
// BEAN — API Route: POST + GET /api/profile
// apps/web/app/api/profile/route.ts
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setUserCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

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

    // 2. Persist dimension scores and attributes
    const dimScores = buildDimScores(data);
    const dimensions = await prisma.dimension.findMany();
    const dimMap = new Map(dimensions.map(d => [d.name, d.id]));

    // 2.1 Create User Attributes (Skills, Interests, etc.)
    // Clear old ones first (simple strategy for this iteration)
    await prisma.userAttribute.deleteMany({ where: { userId: user.id } });

    const attributeOps: any[] = [];

    // Map skills to 'skills' dimension
    if (data.skills.length && dimMap.has('skills')) {
      const dimId = dimMap.get('skills')!;
      data.skills.forEach(skill => {
        attributeOps.push(prisma.userAttribute.create({
          data: { userId: user.id, dimensionId: dimId, name: skill, category: 'skill' }
        }));
      });
    }

    // Map interests to 'interests' dimension
    if (data.interests.length && dimMap.has('interests')) {
      const dimId = dimMap.get('interests')!;
      data.interests.forEach(interest => {
        attributeOps.push(prisma.userAttribute.create({
          data: { userId: user.id, dimensionId: dimId, name: interest, category: 'interest' }
        }));
      });
    }

    // Add profession as an attribute to 'career'
    if (data.profession && dimMap.has('career')) {
      attributeOps.push(prisma.userAttribute.create({
        data: {
          userId: user.id,
          dimensionId: dimMap.get('career')!,
          name: data.profession,
          category: 'profession'
        }
      }));
    }

    await Promise.all(attributeOps);

    // 3. Create initial LifeState snapshot with embedded scores
    const lifeScore =
      dimScores.length > 0
        ? (dimScores.reduce((s, d) => s + d.score, 0) / dimScores.length) * 10
        : data.lifeSatisfaction * 10;

    await prisma.lifeState.create({
      data: {
        userId: user.id,
        lifeScore,
        balanceScore: 0.5,     // Placeholder/Initial
        alignmentScore: 0.5,   // Placeholder/Initial
        energyIndex: 0.5,      // Placeholder/Initial
        triggeredBy: 'onboarding',
        scores: dimScores
          .filter(ds => dimMap.has(ds.key))
          .map(ds => ({
            dimensionId: dimMap.get(ds.key)!,
            score: ds.score,
            trend: 'stable'
          }))
      },
    });

    // 4. Set session cookie
    const res = NextResponse.json(
      { success: true as const, data: { userId: user.id, isNewUser } },
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
        attributes: {
          include: { dimension: true }
        },
        lifeStates: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract latest state
    const latestStateRaw = user.lifeStates[0] ?? null;
    const allDimensions = await prisma.dimension.findMany();
    const dimIdMap = new Map(allDimensions.map(d => [d.id, d]));

    const latestState = latestStateRaw ? {
      ...latestStateRaw,
      scores: latestStateRaw.scores.map(s => ({
        ...s,
        dimension: dimIdMap.get(s.dimensionId)
      }))
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          attributes: user.attributes
        },
        latestState,
        dimensions: allDimensions
      },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/profile]', msg);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        detail: msg 
      },
      { status: 500 }
    );
  }
}

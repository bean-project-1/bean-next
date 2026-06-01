// =======================================================
// BEAN — API Route: POST + GET /api/profile
// apps/web/app/api/profile/route.ts
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ── Validation ─────────────────────────────────────────
const onboardingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  // identidad
  values: z.array(z.string()).default([]),
  personality: z.string().default(''),
  interests: z.array(z.string()).default([]),
  purpose: z.string().default(''),
  motivations: z.string().default(''),
  // capital
  knowledge: z.string().default(''),
  skills: z.array(z.string()).default([]),
  profession: z.string().default(''),
  income: z.string().default(''),
  socialCapital: z.string().default(''),
  exerciseFrequency: z.string().default(''),
  resilience: z.string().default(''),
  // experiencia
  workSatisfaction: z.string().default(''),
  relationships: z.string().default(''),
  lifeSatisfaction: z.string().default(''),
  freeTime: z.string().default(''),
  personalGrowth: z.string().default(''),
  impact: z.string().default(''),
  financialSecurity: z.string().default(''),
  // review + goals
  extractedAttributes: z.array(z.any()).optional(),
  extractedInputs: z.array(z.any()).optional(),
  goals: z
    .array(z.object({ title: z.string().min(1) }))
    .max(3)
    .default([]),
  details: z.record(z.string(), z.string()).default({}),
});

import {
  PERSONALITY_OPTIONS, MOTIVATION_OPTIONS, INCOME_OPTIONS, FREE_TIME_OPTIONS,
  PURPOSE_OPTIONS, KNOWLEDGE_OPTIONS, SOCIAL_CAPITAL_OPTIONS,
  RESILIENCE_OPTIONS, WORK_SATISFACTION_OPTIONS, RELATIONSHIPS_OPTIONS,
  MENTAL_WELLBEING_OPTIONS, PERSONAL_GROWTH_OPTIONS, IMPACT_OPTIONS,
  FINANCIAL_SECURITY_OPTIONS
} from '../../../features/onboarding/constants';

function getLabel(options: any[], id: string) {
  if (!id) return '';
  return options.find(o => o.id === id)?.label || id;
}
// ── POST — Onboarding: create User + BeanProfile + DimensionScores ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Upsert User
    let isNewUser = false;
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    const user = existing
      ? await prisma.user.update({ where: { email: data.email }, data: { name: data.name, onboardingCompleted: true } })
      : await (async () => { isNewUser = true; return prisma.user.create({ data: { email: data.email, name: data.name, onboardingCompleted: true } }); })();

    // 2. Persist attributes and inputs
    const dimensions = await prisma.dimension.findMany();
    const dimMap = new Map(dimensions.map(d => [d.name, d.id]));

    // Clear old attributes first
    await prisma.userAttribute.deleteMany({ where: { userId: user.id } });

    const attributeOps: any[] = [];

    const addAttr = (dimName: string, type: string, val: string, formKey?: string) => {
      if (val && dimMap.has(dimName)) {
        const detail = data.details[formKey || dimName];
        attributeOps.push(prisma.userAttribute.create({
          data: {
            userId: user.id,
            dimensionId: dimMap.get(dimName)!,
            name: val,
            category: type,
            metadata: detail ? { details: detail } : {}
          }
        }));
      }
    };

    // Arrays
    data.skills.forEach(v => addAttr('skills', 'skill', v));
    data.interests.forEach(v => addAttr('interests', 'interest', v));
    data.values.forEach(v => addAttr('values', 'value', v));

    // Direct string
    addAttr('career', 'profession', data.profession, 'profession');
    
    // Mapped Choices
    addAttr('personality', 'trait', getLabel(PERSONALITY_OPTIONS, data.personality), 'personality');
    addAttr('motivations', 'trait', getLabel(MOTIVATION_OPTIONS, data.motivations), 'motivations');
    addAttr('purpose', 'self_assessment', getLabel(PURPOSE_OPTIONS, data.purpose), 'purpose');
    addAttr('knowledge', 'self_assessment', getLabel(KNOWLEDGE_OPTIONS, data.knowledge), 'knowledge');
    addAttr('income', 'self_assessment', getLabel(INCOME_OPTIONS, data.income), 'income');
    addAttr('social_capital', 'self_assessment', getLabel(SOCIAL_CAPITAL_OPTIONS, data.socialCapital), 'socialCapital');
    addAttr('resilience', 'self_assessment', getLabel(RESILIENCE_OPTIONS, data.resilience), 'resilience');
    addAttr('work_satisfaction', 'self_assessment', getLabel(WORK_SATISFACTION_OPTIONS, data.workSatisfaction), 'workSatisfaction');
    addAttr('relationships', 'self_assessment', getLabel(RELATIONSHIPS_OPTIONS, data.relationships), 'relationships');
    addAttr('mental_wellbeing', 'self_assessment', getLabel(MENTAL_WELLBEING_OPTIONS, data.lifeSatisfaction), 'lifeSatisfaction');
    addAttr('personal_growth', 'self_assessment', getLabel(PERSONAL_GROWTH_OPTIONS, data.personalGrowth), 'personalGrowth');
    addAttr('impact', 'self_assessment', getLabel(IMPACT_OPTIONS, data.impact), 'impact');
    addAttr('financial_security', 'self_assessment', getLabel(FINANCIAL_SECURITY_OPTIONS, data.financialSecurity), 'financialSecurity');

    // 2.2 Add AI extracted attributes
    if (data.extractedAttributes?.length) {
      data.extractedAttributes.forEach((attr: any) => {
        if (dimMap.has(attr.dimension)) {
          attributeOps.push(prisma.userAttribute.create({
            data: {
              userId: user.id,
              dimensionId: dimMap.get(attr.dimension)!,
              name: attr.name,
              category: attr.category || 'other',
              metadata: attr.metadata || {}
            }
          }));
        }
      });
    }

    await Promise.all(attributeOps);

    // 2.3 Add dynamic inputs
    const inputOps: any[] = [];

    // Add AI extracted inputs
    if (data.extractedInputs?.length) {
      data.extractedInputs.forEach((input: any) => {
        if (dimMap.has(input.dimension)) {
          inputOps.push(prisma.dimensionInput.create({
            data: {
              userId: user.id,
              dimensionId: dimMap.get(input.dimension)!,
              inputType: input.inputType || 'event',
              valueJson: input.valueJson || {},
              source: 'ai_onboarding'
            }
          }));
        }
      });
    }
    const addInput = (dimName: string, type: string, val: string, formKey?: string) => {
      if (val && dimMap.has(dimName)) {
        const detail = data.details[formKey || dimName];
        inputOps.push(prisma.dimensionInput.create({
          data: { 
            userId: user.id, 
            dimensionId: dimMap.get(dimName)!, 
            inputType: type, 
            valueJson: detail ? { value: val, details: detail } : { value: val }, 
            source: 'manual' 
          }
        }));
      }
    };

    addInput('physical_health', 'routine', data.exerciseFrequency, 'exerciseFrequency');
    addInput('free_time', 'routine', getLabel(FREE_TIME_OPTIONS, data.freeTime), 'freeTime');

    if (inputOps.length > 0) {
      await Promise.all(inputOps);
    }

    // 3. Create initial LifeState snapshot (without scores)
    await prisma.lifeState.create({
      data: {
        userId: user.id,
        lifeScore: 0,
        balanceScore: 0,
        alignmentScore: 0,
        energyIndex: 0,
        triggeredBy: 'onboarding',
        scores: []
      },
    });

    // 4. Register any defined Goals from GoalPhase
    if (data.goals.length > 0) {
      await Promise.all(
        data.goals.map(goal => 
          prisma.goal.create({
            data: {
              userId: user.id,
              title: goal.title,
              status: 'active',
              progress: 0,
            }
          })
        )
      );
    }

    // Default sleep commitment is now created globally at User registration level

    // 6. Set session cookie
    const res = NextResponse.json(
      { success: true as const, data: { userId: user.id, isNewUser } },
      { status: 201 }
    );
    // Cookie is now managed by NextAuth during sign-in, not here
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
    const session = await auth();
    const userId = session?.user?.id;
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
        },
        baseCommitments: {
          include: { dimensions: true },
          where: { isActive: true }
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
          attributes: user.attributes,
          baseCommitments: user.baseCommitments
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

// ── PUT — Update basic user profile (name) ──
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name } = await req.json();
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[PUT /api/profile]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

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
  // rutina
  sleepHours: z.number().default(8),
  workSchedule: z.string().default('none'),
  // review + ideas
  extractedAttributes: z.array(z.any()).optional(),
  extractedInputs: z.array(z.any()).optional(),
  resumeText: z.string().optional(),
  ideas: z
    .array(z.object({ title: z.string().min(1) }))
    .max(5)
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
      ? await prisma.user.update({ where: { email: data.email }, data: { name: data.name, onboardingCompleted: true, hasSeenTour: false } })
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

    // 3. Find or Create default Space
    let space = await prisma.space.findFirst({
      where: {
        members: {
          some: { userId: user.id, role: 'owner' }
        }
      }
    });

    if (!space) {
      space = await prisma.space.create({
        data: {
          name: 'Mi Árbol',
          description: 'Tu espacio principal para crecer',
          theme: 'green',
          members: {
            create: {
              userId: user.id,
              role: 'owner'
            }
          }
        }
      });
    } else {
      // Opt: ensure the name is 'Mi Árbol' if they had the old duplicate names
      if (space.name === 'Mi Bosque Personal' || space.name === 'Mi Arbol Personal' || space.name === 'Mi Árbol Personal') {
        space = await prisma.space.update({
          where: { id: space.id },
          data: { name: 'Mi Árbol' }
        });
      }
    }

    // 4. Create or Update Base Commitments (Routine)
    const baseCommitments = [];
    
    // Sleep
    const healthDim = dimensions.find(d => d.name === 'physical_health');
    const existingSleep = await prisma.baseCommitment.findFirst({
      where: {
        userId: user.id,
        title: 'Dormir',
      },
    });

    if (existingSleep) {
      await prisma.baseCommitment.update({
        where: { id: existingSleep.id },
        data: {
          hoursPerDay: data.sleepHours,
          spaceId: space.id,
          dimensionIds: healthDim ? [healthDim.id] : [],
        },
      });
    } else {
      baseCommitments.push({
        userId: user.id,
        title: 'Dormir',
        type: 'routine',
        hoursPerDay: data.sleepHours,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Everyday
        dimensionIds: healthDim ? [healthDim.id] : [],
        spaceId: space.id,
        isActive: true,
      });
    }

    // Work/Study
    if (data.workSchedule && data.workSchedule !== 'none') {
      const careerDim = dimensions.find(d => d.name === 'career');
      const title = data.workSchedule === 'study' ? 'Estudio Principal' : 'Trabajo Principal';
      const hours = data.workSchedule === '9-5' ? 8 : (data.workSchedule === 'study' ? 6 : 4);
      const days = data.workSchedule === '9-5' ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5]; // Mon-Fri
      const type = data.workSchedule === 'study' ? 'study' : 'work';

      const existingWorkStudy = await prisma.baseCommitment.findFirst({
        where: {
          userId: user.id,
          title: { in: ['Trabajo Principal', 'Estudio Principal'] },
        },
      });

      if (existingWorkStudy) {
        await prisma.baseCommitment.update({
          where: { id: existingWorkStudy.id },
          data: {
            title,
            type,
            hoursPerDay: hours,
            daysOfWeek: days,
            dimensionIds: careerDim ? [careerDim.id] : [],
            spaceId: space.id,
          },
        });
      } else {
        baseCommitments.push({
          userId: user.id,
          title,
          type,
          hoursPerDay: hours,
          daysOfWeek: days,
          dimensionIds: careerDim ? [careerDim.id] : [],
          spaceId: space.id,
          isActive: true,
        });
      }
    }

    if (baseCommitments.length > 0) {
      await prisma.baseCommitment.createMany({
        data: baseCommitments
      });
    }

    // 5. Save UserResume if provided
    if (data.resumeText) {
      await prisma.userResume.create({
        data: {
          userId: user.id,
          title: 'Hoja de Vida Base (Onboarding)',
          isBase: true,
          rawText: data.resumeText,
        }
      });
    }

    // 6. Register any defined Ideas into the Incubator
    if (data.ideas.length > 0) {
      await Promise.all(
        data.ideas.map(idea => 
          prisma.incubatorSeed.create({
            data: {
              userId: user.id,
              spaceId: space.id,
              title: idea.title,
              description: idea.title,
              status: 'new',
              scores: { sun: 0, earth: 0, water: 0 },
              messages: [],
              clouds: []
            }
          })
        )
      );
    }

    // 7. Set session cookie
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

    const allDimensions = await prisma.dimension.findMany();

    const hasCustomApiKey = !!req.cookies.get('bean_byok_key')?.value;
    const byokProvider = req.cookies.get('bean_byok_provider')?.value || 'openai';

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          hasSeenTour: user.hasSeenTour,
          attributes: user.attributes,
          baseCommitments: user.baseCommitments,
          notificationPreferences: user.notificationPreferences,
          createdAt: user.createdAt,
          hasCustomApiKey,
          byokProvider
        },
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

    const { name, notificationPreferences, hasSeenTour } = await req.json();
    const dataToUpdate: any = {};
    
    if (name !== undefined) {
      if (name.trim() === '') {
        return NextResponse.json(
          { success: false, error: 'Name is required' },
          { status: 400 }
        );
      }
      dataToUpdate.name = name;
    }
    
    if (notificationPreferences !== undefined) {
      dataToUpdate.notificationPreferences = notificationPreferences;
    }

    if (hasSeenTour !== undefined) {
      dataToUpdate.hasSeenTour = hasSeenTour;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[PUT /api/profile]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE — Delete user account and cascade data ──
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log(`[DELETE /api/profile] Deleting all data cascades for user ${userId}`);

    // Perform manual cascade deletes in transaction to avoid relation violations
    await prisma.$transaction(async (tx) => {
      // 1. Delete incubator seeds
      await tx.incubatorSeed.deleteMany({ where: { userId } });
      
      // 2. Delete dimension inputs
      await tx.dimensionInput.deleteMany({ where: { userId } });

      // 3. Delete push subscriptions
      await tx.pushSubscription.deleteMany({ where: { userId } });

      // 4. Delete chat sessions (cascades to chat messages)
      await tx.chatSession.deleteMany({ where: { userId } });

      // 5. Delete resumes
      await tx.userResume.deleteMany({ where: { userId } });

      // 6. Delete base commitments
      await tx.baseCommitment.deleteMany({ where: { userId } });

      // 7. Delete goals and goal actions (delete child sub-actions first to avoid self-relation violations)
      const userGoals = await tx.goal.findMany({ where: { userId } });
      const goalIds = userGoals.map(g => g.id);
      await tx.goalAction.deleteMany({ where: { goalId: { in: goalIds }, parentId: { not: null } } });
      await tx.goalAction.deleteMany({ where: { goalId: { in: goalIds } } });
      await tx.goal.deleteMany({ where: { userId } });

      // 8. Find and delete spaces owned by the user, and their memberships
      const spacesOwned = await tx.space.findMany({
        where: {
          members: {
            some: { userId, role: 'owner' }
          }
        }
      });
      const spaceIds = spacesOwned.map(s => s.id);
      await tx.spaceMember.deleteMany({ where: { spaceId: { in: spaceIds } } });
      await tx.space.deleteMany({ where: { id: { in: spaceIds } } });
      await tx.spaceMember.deleteMany({ where: { userId } });

      // 9. Delete user attributes
      await tx.userAttribute.deleteMany({ where: { userId } });

      // 10. Delete other user-related models
      await tx.notificationLog.deleteMany({ where: { userId } });
      await tx.suggestedPath.deleteMany({ where: { userId } });
      await tx.lifeEvent.deleteMany({ where: { userId } });
      await tx.postIt.deleteMany({ where: { userId } });
      await tx.dailyTask.deleteMany({ where: { userId } });
      await tx.spaceMessage.deleteMany({ where: { userId } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });

      // 11. Finally, delete the User record
      await tx.user.delete({
        where: { id: userId }
      });
    }, {
      timeout: 15000
    });

    console.log(`[DELETE /api/profile] Successfully deleted user account ${userId}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[DELETE /api/profile] Error:', msg);
    return NextResponse.json(
      { success: false, error: 'Failed to delete account', detail: msg },
      { status: 500 }
    );
  }
}


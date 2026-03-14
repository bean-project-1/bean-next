// =======================================================
// BEAN — API Route: POST /api/profile
// apps/web/app/api/profile/route.ts
//
// Receives onboarding data, creates or updates BeanProfile,
// and triggers initial AI analysis.
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiResponse, BeanProfile } from '@bean/types';

// ---- Validation Schema ----

const onboardingSchema = z.object({
  profession: z.string().min(1, 'Profession is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  interests: z.array(z.string()).min(1, 'At least one interest is required'),
  exerciseFrequency: z.string().min(1, 'Exercise frequency is required'),
  lifeSatisfaction: z.number().min(0).max(10),
  values: z.array(z.string()).optional(),
  motivations: z.array(z.string()).optional(),
});

// ---- Handler ----

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<BeanProfile>>> {
  try {
    const body = await req.json();

    // Validate input
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // TODO: Get authenticated user from session
    // const session = await getServerSession();
    // const userId = session?.user?.id ?? 'demo-user';
    const userId = 'demo-user';

    // TODO: Upsert BeanProfile in database via Prisma
    // const profile = await prisma.beanProfile.upsert({
    //   where: { userId },
    //   create: {
    //     userId,
    //     identity: { values: data.values ?? [], interests: data.interests, motivations: data.motivations ?? [] },
    //     capital: { skills: data.skills, knowledge: [], careerStage: data.profession },
    //     wellbeing: { healthScore: data.lifeSatisfaction, relationshipsScore: 5, happinessScore: data.lifeSatisfaction },
    //   },
    //   update: { ... },
    // });

    // Build a mock profile response
    const profile: BeanProfile = {
      id: `profile_${Date.now()}`,
      userId,
      identity: {
        values: data.values ?? [],
        interests: data.interests,
        motivations: data.motivations ?? [],
      },
      capital: {
        knowledge: [],
        skills: data.skills,
        careerStage: data.profession,
        jobTitle: data.profession,
      },
      wellbeing: {
        healthScore: data.lifeSatisfaction,
        relationshipsScore: 5,
        happinessScore: data.lifeSatisfaction,
        exerciseFrequency: data.exerciseFrequency,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Trigger async AI analysis
    // await analyzeProfile({ userId, profile });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/profile]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// ---- GET current profile ----

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<BeanProfile>>> {
  try {
    // TODO: Get userId from session
    // const session = await getServerSession();

    // TODO: Fetch from DB
    // const profile = await prisma.beanProfile.findUnique({ where: { userId } });

    return NextResponse.json(
      { success: false, error: 'Not implemented yet', code: 'NOT_IMPLEMENTED' },
      { status: 501 }
    );
  } catch (err) {
    console.error('[GET /api/profile]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

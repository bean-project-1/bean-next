import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CareerService } from '@/services/career-service';

const careerService = new CareerService();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { jobTitle, company, jobOfferText } = await req.json();
    if (!jobTitle || !company || !jobOfferText) {
      return NextResponse.json({ error: 'Faltan campos requeridos (jobTitle, company, jobOfferText)' }, { status: 400 });
    }

    // Generate career plan structure using AI (does not save to database)
    const plan = await careerService.generateCareerPlan(userId, jobTitle, company, jobOfferText);

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error('[POST /api/career/jobs/diagnose] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

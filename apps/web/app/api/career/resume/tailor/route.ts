import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { CareerService } from '@/services/career-service';

const careerService = new CareerService();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { jobOfferText } = await req.json();
    if (!jobOfferText || !jobOfferText.trim()) {
      return NextResponse.json({ error: 'Oferta de empleo vacía' }, { status: 400 });
    }

    // Fetch the base resume
    let resume = await prisma.userResume.findFirst({
      where: { userId, isBase: true }
    });

    // If no base resume is found, fall back to the most recently updated resume
    if (!resume) {
      resume = await prisma.userResume.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      });
      
      // Mark it as base in the database to keep consistency
      if (resume) {
        resume = await prisma.userResume.update({
          where: { id: resume.id },
          data: { isBase: true }
        });
      }
    }

    if (!resume || !resume.parsedData) {
      return NextResponse.json({ error: 'Debes tener un CV cargado para poder optimizarlo.' }, { status: 400 });
    }

    // Tailor the resume using AI
    const tailoredResume = await careerService.tailorResumeForJob(resume.parsedData, jobOfferText);

    return NextResponse.json({ success: true, tailoredResume });
  } catch (error: any) {
    console.error('[POST /api/career/resume/tailor] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { CareerService } from '@/services/career-service';

const careerService = new CareerService();

// GET: List all resumes for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const resumes = await prisma.userResume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ success: true, resumes });
  } catch (error: any) {
    console.error('[GET /api/career/resume] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Parse CV and create a new resume in the user's inventory
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { text, title, targetJob, targetCompany, parsedData: clientParsedData } = await req.json();

    // Check if the user already has a base resume
    const existingBase = await prisma.userResume.findFirst({
      where: { userId, isBase: true }
    });

    let parsedData = clientParsedData;
    let rawText = text;

    if (!parsedData) {
      if (!text || !text.trim()) {
        return NextResponse.json({ error: 'Texto de CV vacío o parsedData no provisto' }, { status: 400 });
      }
      // Parse CV text using AI
      parsedData = await careerService.parseResumeWithAI(text);
    } else {
      // If parsedData is provided, construct rawText if it wasn't passed
      if (!rawText) {
        rawText = `
PERFIL PROFESIONAL OPTIMIZADO:
${parsedData.summary || ''}

HABILIDADES:
${parsedData.skills?.join(', ') || ''}

EXPERIENCIA ADAPTADA:
${parsedData.experience?.map((e: any) => `- ${e.role} en ${e.company} (${e.duration}):\n  ${e.description}`).join('\n\n') || ''}
        `;
      }
    }

    // Save as a new resume in inventory
    const resume = await prisma.userResume.create({
      data: {
        userId,
        title: title || `CV Importado - ${new Date().toLocaleDateString('es-ES')}`,
        isBase: !existingBase, // If no base resume exists, make this the base
        summary: parsedData.summary || '',
        parsedData,
        rawText,
        targetJob: targetJob || null,
        targetCompany: targetCompany || null
      }
    });

    // If it's set as base, sync to DNA Attributes
    if (!existingBase) {
      await careerService.syncResumeToDNA(userId, parsedData);
    }

    return NextResponse.json({ success: true, resume });
  } catch (error: any) {
    console.error('[POST /api/career/resume] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update manual edits for a specific resume (or toggle base status)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id, title, summary, parsedData, isBase } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Falta el ID de la hoja de vida a actualizar' }, { status: 400 });
    }

    let updatedResume;

    if (isBase) {
      // Transaction to unset base flag on other resumes and set it on this one
      updatedResume = await prisma.$transaction(async (tx) => {
        await tx.userResume.updateMany({
          where: { userId, id: { not: id } },
          data: { isBase: false }
        });

        const updated = await tx.userResume.update({
          where: { id },
          data: {
            title,
            summary,
            parsedData,
            isBase: true
          }
        });

        return updated;
      });

      // Sync the new base CV to DNA Attributes
      await careerService.syncResumeToDNA(userId, parsedData || {});
    } else {
      updatedResume = await prisma.userResume.update({
        where: { id },
        data: {
          title,
          summary,
          parsedData
        }
      });
    }

    return NextResponse.json({ success: true, resume: updatedResume });
  } catch (error: any) {
    console.error('[PUT /api/career/resume] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

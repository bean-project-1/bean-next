import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { CareerService } from '@/services/career-service';

const careerService = new CareerService();

// DELETE: Delete a resume from the inventory
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;

    // Check if the resume exists and belongs to the user
    const resume = await prisma.userResume.findFirst({
      where: { id, userId }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Hoja de vida no encontrada' }, { status: 404 });
    }

    // If it is the base resume, find if there is another resume to make base
    if (resume.isBase) {
      const anotherResume = await prisma.userResume.findFirst({
        where: { userId, id: { not: id } }
      });

      await prisma.$transaction(async (tx) => {
        if (anotherResume) {
          await tx.userResume.update({
            where: { id: anotherResume.id },
            data: { isBase: true }
          });
        }
        await tx.userResume.delete({
          where: { id }
        });
      });

      // If another resume became base, sync its DNA
      if (anotherResume && anotherResume.parsedData) {
        await careerService.syncResumeToDNA(userId, anotherResume.parsedData);
      }
    } else {
      await prisma.userResume.delete({
        where: { id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/career/resume/[id]] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Toggle isBase or update title
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isBase, title } = body;

    const resume = await prisma.userResume.findFirst({
      where: { id, userId }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Hoja de vida no encontrada' }, { status: 404 });
    }

    let updatedResume;

    if (isBase) {
      // Transaction to set this as base and unset other resumes
      updatedResume = await prisma.$transaction(async (tx) => {
        await tx.userResume.updateMany({
          where: { userId, id: { not: id } },
          data: { isBase: false }
        });

        const updated = await tx.userResume.update({
          where: { id },
          data: { isBase: true, title: title || resume.title }
        });

        return updated;
      });

      // Sync the new base CV to DNA Attributes
      if (updatedResume.parsedData) {
        await careerService.syncResumeToDNA(userId, updatedResume.parsedData);
      }
    } else {
      updatedResume = await prisma.userResume.update({
        where: { id },
        data: { title: title || resume.title }
      });
    }

    return NextResponse.json({ success: true, resume: updatedResume });
  } catch (error: any) {
    console.error('[PATCH /api/career/resume/[id]] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

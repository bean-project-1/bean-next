import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const seeds = await prisma.incubatorSeed.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ seeds });
  } catch (error) {
    console.error('Error fetching seeds:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    const seed = await prisma.incubatorSeed.create({
      data: {
        userId: session.user.id,
        title,
        description: description || '',
        status: 'new',
        scores: { sun: 10, earth: 10, water: 10 },
        messages: [{
          id: Date.now().toString(),
          role: 'system',
          content: `¡Hola! Qué gran idea: "${title}". Para empezar a madurarla, cuéntame: ¿Qué problema principal intentas resolver con esto?`,
          timestamp: Date.now()
        }],
        clouds: [],
        proposal: ''
      }
    });

    return NextResponse.json({ seed });
  } catch (error) {
    console.error('Error creating seed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

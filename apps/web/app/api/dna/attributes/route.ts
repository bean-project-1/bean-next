import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { dimensionId, name, category = 'skill', level = 'learned' } = body;

    if (!dimensionId || !name) {
      return NextResponse.json({ error: 'Missing dimensionId or name' }, { status: 400 });
    }

    const newAttribute = await prisma.userAttribute.create({
      data: {
        userId,
        dimensionId,
        name,
        category,
        metadata: { level }
      }
    });

    return NextResponse.json({ success: true, attribute: newAttribute });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

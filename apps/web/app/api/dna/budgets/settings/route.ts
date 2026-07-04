import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { payday: true, accumulatedSavings: true },
    });

    return NextResponse.json({ success: true, settings: user });
  } catch (error: any) {
    console.error('Error in GET /api/dna/budgets/settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { payday, accumulatedSavings } = body;

    const data: any = {};
    if (payday !== undefined) data.payday = payday;
    if (accumulatedSavings !== undefined) data.accumulatedSavings = accumulatedSavings;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { payday: true, accumulatedSavings: true },
    });

    return NextResponse.json({ success: true, settings: user });
  } catch (error: any) {
    console.error('Error in POST /api/dna/budgets/settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

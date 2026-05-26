import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {

  try {
    const users = await (prisma as any).user.findMany();
    const dimensions = await (prisma as any).dimension.findMany();
    const lifeStates = await (prisma as any).lifeState.findMany();
    const goals = await (prisma as any).goal.findMany({
      where: { user: { email: 'daniel@bean.app' } },
      include: { actions: true }
    });
    return NextResponse.json({ count: goals.length, goals });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

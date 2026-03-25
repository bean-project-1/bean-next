import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../../lib/generated-prisma');

export async function GET(req: NextRequest) {
  const p = new PrismaClient();
  try {
    const goals = await (p as any).goal.findMany({
      where: { user: { email: 'daniel@bean.app' } },
      include: { actions: true }
    });
    return NextResponse.json({ count: goals.length, goals });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await p.$disconnect();
  }
}

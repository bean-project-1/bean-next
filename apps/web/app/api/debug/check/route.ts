import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        onboardingCompleted: true,
        createdAt: true,
      }
    });

    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        provider: true,
        providerAccountId: true,
      }
    });

    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        expires: true,
      }
    });

    return NextResponse.json({
      success: true,
      users,
      accounts,
      sessions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


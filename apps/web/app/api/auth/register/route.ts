import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setUserCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ success: false, error: 'Name and Email are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    const res = NextResponse.json({ success: true, userId: user.id });
    setUserCookie(res, user.id);
    return res;
  } catch (err) {
    console.error('[POST /api/auth/register]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

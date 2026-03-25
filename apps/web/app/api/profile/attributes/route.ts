import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../../lib/generated-prisma');

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { dimensionId, name, category } = await req.json();

    if (!dimensionId || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const attribute = await (prisma as any).userAttribute.create({
      data: {
        userId,
        dimensionId,
        name,
        category: category || 'other',
        metadata: {}
      },
      include: {
        dimension: true
      }
    });

    console.log(`[POST /api/profile/attributes] Created attribute: ${attribute.name} for user ${userId}`);

    return NextResponse.json({
      success: true,
      data: attribute
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/profile/attributes] Error:', msg);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      detail: msg
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { identityService } from '@/services/identity-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const identity = await identityService.getFullIdentity(userId);

    return NextResponse.json({ success: true, identity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

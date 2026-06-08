import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CareerService } from '@/services/career-service';

const careerService = new CareerService();

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Simulate jobs based on DNA + Resume
    const jobs = await careerService.simulateJobs(userId);

    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    console.error('[GET /api/career/jobs] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

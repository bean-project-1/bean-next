import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Dimension, DimensionScore } from '@prisma/client';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'daniel@bean.app' }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const latestState = await prisma.lifeState.findFirst({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' }
    });

    const dimensions = await prisma.dimension.findMany();
    const dimMap = dimensions.reduce((acc: Record<string, Dimension>, d: Dimension) => ({ ...acc, [d.id]: d }), {});

    const treeData = {
      growthScore: latestState?.lifeScore || 0,
      branches: latestState?.scores.map((s: DimensionScore) => {
        const dim = dimMap[s.dimensionId];
        return {
          id: s.dimensionId,
          goal: dim?.label || 'Dimension',
          progress: s.score * 10,
          leaves: [
            { id: `${s.dimensionId}-l1`, name: 'Actividad Base', completed: true },
            { id: `${s.dimensionId}-l2`, name: 'Próximo Paso', completed: false },
          ]
        };
      }) || []
    };

    return NextResponse.json(treeData);
  } catch (error) {
    console.error('Error fetching life tree data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {

  try {
    const email = 'daniel@bean.app';
    const user = await (prisma.user.findUnique({ where: { email } }));
    if (!user) return NextResponse.json({ error: 'User not found' });

    await prisma.user.deleteMany({});
    await prisma.dimension.deleteMany({});
    await prisma.userAttribute.deleteMany({});


    // Add 3 Goals
    const goals = [
      { title: 'Ser Data Scientist Senior', progress: 65, actions: [
          { title: 'Python Avanzado', isCompleted: true },
          { title: 'Estadística para ML', isCompleted: true },
          { title: 'Portafolio en GitHub', isCompleted: false }
        ]
      },
      { title: 'Viaje a Japón 2026', progress: 30, actions: [
          { title: 'Aprender Hiragana', isCompleted: true },
          { title: 'Reservar Vuelos', isCompleted: false }
        ]
      },
      { title: 'Maratón de Nueva York', progress: 55, actions: [
          { title: 'Entrenar 10km', isCompleted: true },
          { title: 'Inscripción Maratón', isCompleted: true }
        ]
      }
    ];

    for (const g of goals) {
      const goal = await (prisma as any).goal.create({
        data: { userId: user.id, title: g.title, progress: g.progress }
      });
      for (const action of g.actions) {
        await (prisma as any).goalAction.create({
          data: { goalId: goal.id, title: action.title, isCompleted: action.isCompleted }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Tree seeded successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

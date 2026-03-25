import { NextRequest, NextResponse } from 'next/server';
const { PrismaClient } = require('../../../../lib/generated-prisma');

export async function GET(req: NextRequest) {
  const p = new PrismaClient();
  try {
    const email = 'daniel@bean.app';
    const user = await ((p as any).user.findUnique({ where: { email } }));
    if (!user) return NextResponse.json({ error: 'User not found' });

    // Clear existing
    await (p as any).goalAction.deleteMany({ where: { goal: { userId: user.id } } });
    await (p as any).goal.deleteMany({ where: { userId: user.id } });

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
      const goal = await (p as any).goal.create({
        data: { userId: user.id, title: g.title, progress: g.progress }
      });
      for (const action of g.actions) {
        await (p as any).goalAction.create({
          data: { goalId: goal.id, title: action.title, isCompleted: action.isCompleted }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Tree seeded successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await p.$disconnect();
  }
}

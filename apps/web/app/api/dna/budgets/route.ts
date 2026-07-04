import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const monthStr = searchParams.get('month');
    const yearStr = searchParams.get('year');

    if (!monthStr || !yearStr) {
      return NextResponse.json({ success: false, error: 'Month and year are required' }, { status: 400 });
    }

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    let budget = await prisma.budgetMonth.findFirst({
      where: {
        userId: session.user.id,
        month,
        year,
      },
    });

    if (!budget) {
      // Intentar buscar el mes anterior para autocompletar
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      
      const prevBudget = await prisma.budgetMonth.findFirst({
        where: {
          userId: session.user.id,
          month: prevMonth,
          year: prevYear,
        },
      });

      if (prevBudget) {
        // Clonar configuración del mes anterior y guardarla
        budget = await prisma.budgetMonth.create({
          data: {
            userId: session.user.id,
            month,
            year,
            incomes: prevBudget.incomes,
            expenses: prevBudget.expenses,
          },
        });
      }
    }

    return NextResponse.json({ success: true, budget });
  } catch (error: any) {
    console.error('Error in GET /api/dna/budgets:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { month, year, incomes, expenses } = body;

    if (typeof month !== 'number' || typeof year !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid month or year' }, { status: 400 });
    }

    let budget = await prisma.budgetMonth.findFirst({
      where: {
        userId: session.user.id,
        month,
        year,
      },
    });

    if (budget) {
      budget = await prisma.budgetMonth.update({
        where: { id: budget.id },
        data: {
          incomes: incomes || [],
          expenses: expenses || [],
        },
      });
    } else {
      budget = await prisma.budgetMonth.create({
        data: {
          userId: session.user.id,
          month,
          year,
          incomes: incomes || [],
          expenses: expenses || [],
        },
      });
    }

    return NextResponse.json({ success: true, budget });
  } catch (error: any) {
    console.error('Error in POST /api/dna/budgets:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

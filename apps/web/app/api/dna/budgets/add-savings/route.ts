import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const budget = await prisma.budgetMonth.findFirst({
      where: {
        userId: session.user.id,
        month,
        year,
      },
    });

    if (!budget) {
      return NextResponse.json({ success: false, error: 'No budget found for this month' }, { status: 404 });
    }

    const incomes = budget.incomes as any[];
    const expenses = budget.expenses as any[];

    const mainIncome = incomes.find(i => i.type === 'main')?.amount || 0;
    
    // Sum all savings buckets
    let savingsAmount = 0;
    expenses.forEach(e => {
      if (e.isSavings) {
        savingsAmount += mainIncome * (e.percentage / 100);
      }
    });

    if (savingsAmount <= 0) {
      return NextResponse.json({ success: false, error: 'No savings configured' }, { status: 400 });
    }

    // Add to accumulated savings
    const user = await prisma.user.findUnique({ where: { id: session.user.id }});
    const newSavings = (user?.accumulatedSavings || 0) + savingsAmount;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { accumulatedSavings: newSavings }
    });

    return NextResponse.json({ success: true, addedAmount: savingsAmount, newTotal: newSavings });
  } catch (error: any) {
    console.error('Error in POST /api/dna/budgets/add-savings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

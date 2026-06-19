import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration: Habits to BaseCommitments');

  // 1. Find all GoalActions of type "habit"
  const habits = await prisma.goalAction.findMany({
    where: { type: 'habit' },
    include: { goal: true }
  });

  console.log(`Found ${habits.length} habits to migrate.`);

  // 2. Map and insert into BaseCommitment
  for (const habit of habits) {
    if (!habit.goal) {
      console.warn(`Habit ${habit.id} has no associated goal. Skipping or you can choose to handle.`);
      continue;
    }

    try {
      await prisma.baseCommitment.create({
        data: {
          userId: habit.goal.userId,
          goalId: habit.goal.id,
          title: habit.title,
          description: habit.description,
          type: 'goal_routine',
          frequency: habit.frequency ? (habit.frequency as any) : null,
          estimatedHours: habit.estimatedHours || 1,
          streakCount: habit.streak || 0,
          isActive: true,
          attributes: habit.attributes || [],
          daysOfWeek: [], // Migration default
        }
      });
      console.log(`Migrated habit: ${habit.title}`);
    } catch (e) {
      console.error(`Error migrating habit ${habit.id}:`, e);
    }
  }

  // 3. Delete old habits
  if (habits.length > 0) {
    const ids = habits.map(h => h.id);
    await prisma.goalAction.deleteMany({
      where: { id: { in: ids } }
    });
    console.log(`Deleted ${ids.length} old habits from GoalAction.`);
  }

  console.log('Migration complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

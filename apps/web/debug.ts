import { prisma } from './lib/prisma';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'dhdiazg1@gmail.com' }
  });
  
  if (user) {
    const fallbackAction = await prisma.goalAction.findFirst({
      where: { goal: { userId: user.id }, isCompleted: false }
    });
    console.log("fallbackAction:", fallbackAction);
    
    // Now let's test Task (subtasks)
    const task = await prisma.task.findFirst({
      where: { goalAction: { goal: { userId: user.id } }, isCompleted: false }
    });
    console.log("task:", task);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

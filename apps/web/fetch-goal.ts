import { PrismaClient } from './lib/generated-prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const goal = await prisma.goal.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      actions: {
        include: {
          tasks: true
        }
      }
    }
  });

  if (!goal) {
    console.log("No goals found.");
    return;
  }

  console.log("Goal:", goal.title, " | Description:", goal.description);
  console.log("Target Gap:", JSON.stringify(goal.target, null, 2));
  
  const phases = goal.actions.filter(a => a.type === 'phase');
  const habits = goal.actions.filter(a => a.type === 'habit');
  
  for (const phase of phases) {
    console.log("\n[PHASE]", phase.title);
    const subactions = goal.actions.filter(a => a.parentId === phase.id);
    for (const sub of subactions) {
      if (sub.type === 'task') {
        console.log(`  - [TASK] ${sub.title} (${sub.estimatedHours}h)`);
      } else if (sub.type === 'milestone') {
        console.log(`  - [MILESTONE] ${sub.title}`);
      }
    }
  }
  
  console.log("\n[HABITS]");
  for (const habit of habits) {
    console.log(`  - ${habit.title} (${habit.estimatedHours}h) - Freq:`, habit.frequency);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

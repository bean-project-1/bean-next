import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function diagnose() {
  const users = await prisma.user.findMany();
  console.log("--- USERS ---");
  users.forEach(u => console.log(`- User ID: ${u.id}, Name: ${u.name}, Email: ${u.email}`));

  const spaces = await prisma.space.findMany({
    include: {
      members: {
        include: {
          user: true
        }
      },
      _count: { select: { goals: true } }
    }
  });

  console.log("\n--- SPACES ---");
  spaces.forEach(s => {
    console.log(`- Space ID: ${s.id}, Name: "${s.name}", Goals: ${s._count.goals}`);
    s.members.forEach(m => {
      console.log(`  * Member: ${m.user.name} (${m.role})`);
    });
  });

  const goals = await prisma.goal.findMany({
    include: {
      user: true,
      space: true
    }
  });
  console.log("\n--- GOALS ---");
  goals.forEach(g => {
    console.log(`- Goal ID: ${g.id}, Title: "${g.title}", User: ${g.user?.name}, Space: ${g.space?.name || 'NONE (spaceId: ' + g.spaceId + ')'}`);
  });
}

diagnose()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

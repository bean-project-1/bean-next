const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const goal = await prisma.goal.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      actions: {
        where: { parentId: null },
        include: {
          subActions: {
            include: {
              subActions: true
            }
          }
        }
      }
    }
  });
  console.log(JSON.stringify(goal, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

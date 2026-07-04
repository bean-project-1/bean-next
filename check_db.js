const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: {
      spaceMembers: {
        include: {
          space: {
            include: {
              goals: true
            }
          }
        }
      },
      goals: true
    }
  });

  console.log(JSON.stringify(users, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());

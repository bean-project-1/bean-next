import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'daniel@bean.app' } });
  if (user) {
    const goals = await prisma.goal.findMany({ where: { userId: user.id } });
    console.log("Goals for Daniel:");
    goals.forEach(g => console.log(`- ${g.title} (Space ID: ${g.spaceId})`));
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

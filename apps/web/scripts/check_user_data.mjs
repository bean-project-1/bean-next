import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { id: true, email: true, name: true }
  });
  console.log("Users:", users);
  
  for (const user of users) {
    const goals = await prisma.goal.count({ where: { userId: user.id } });
    const spaces = await prisma.spaceMember.count({ where: { userId: user.id } });
    const spacesDetails = await prisma.spaceMember.findMany({
      where: { userId: user.id },
      include: { space: true }
    });
    console.log(`User ${user.email} has ${goals} goals and is in ${spaces} spaces`);
    console.log(`Spaces for ${user.email}:`, spacesDetails.map(s => s.space.name));
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

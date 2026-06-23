import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function restorePersonalTree() {
  const user = await prisma.user.findFirst({ where: { email: 'daniel@bean.app' } });
  if (!user) {
    console.log("User not found");
    return;
  }

  // Check if they already have the space
  let space = await prisma.space.findFirst({
    where: {
      members: { some: { userId: user.id } },
      name: { in: ['Mi Bosque Personal', 'Mi Arbol Personal', 'Mi Árbol Personal'] }
    }
  });

  if (!space) {
    space = await prisma.space.create({
      data: {
        name: 'Mi Bosque Personal',
        description: 'Tu espacio personal para cultivar tus metas y hábitos.',
        theme: 'green',
        members: {
          create: {
            userId: user.id,
            role: 'owner'
          }
        }
      }
    });
    console.log("Created Personal Tree:", space.id);
  } else {
    console.log("Personal Tree already exists:", space.id);
  }

  const result = await prisma.goal.updateMany({
    where: { userId: user.id, spaceId: null },
    data: { spaceId: space.id }
  });
  
  console.log(`Linked ${result.count} orphaned goals to the personal tree.`);
}

restorePersonalTree()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

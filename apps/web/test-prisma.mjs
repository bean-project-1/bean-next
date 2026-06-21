import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const seeds = await prisma.incubatorSeed.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 1
  });
  console.log(JSON.stringify(seeds, null, 2));
}
run();

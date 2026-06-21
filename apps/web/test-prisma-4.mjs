import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const seeds = await prisma.incubatorSeed.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  console.log(`Found ${seeds.length} seeds`);
}
run();

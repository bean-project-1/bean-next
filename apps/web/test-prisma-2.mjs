import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const seeds = await prisma.incubatorSeed.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 1
  });
  console.log("Proposal type:", typeof seeds[0].proposal);
  console.log("Proposal:", seeds[0].proposal);
}
run();

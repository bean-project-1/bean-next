import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const seeds = await prisma.incubatorSeed.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  console.log(JSON.stringify(seeds.map(s => ({
    id: s.id,
    title: s.title,
    scores: s.scores
  })), null, 2));
}
run();
